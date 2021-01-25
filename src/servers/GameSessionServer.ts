import { Observable, timer } from 'rxjs'
import { takeUntil, mergeMap, mapTo, filter } from 'rxjs/operators'
import { GameSessionId, GameSession } from '../sessions/GameSession'
import { HumanGameSession } from '../sessions/HumanGameSession'
import { UserSession, UserSessionId } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'
import { Socket } from 'socket.io'

export class GameSessionServer {

    private waitingUserId: UserSessionId | null = null
    private waitingSockets: Socket[] = []
    private gameSessions: Map<GameSessionId, GameSession> = new Map()
    private sessionsOfUsers: Map<UserSessionId, GameSession[]> = new Map()

    private userTimeoutPeriod: number = 1000

    constructor(private userSessionServer: UserSessionServer) {
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame)
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction)
        this.userSessionServer.socketRegistration$.subscribe(this.handleSocketRegistration)
        this.userSessionServer.disconnect$.subscribe(this.handleSocketDisconnect)
        this.userSessionServer.sessionClose$.subscribe(this.handleUserSessionClose)
        this.userSessionTimeout$.subscribe(this.handleUserTimeout)
    }

    private get userSessionTimeout$(): Observable<UserSessionId> {
        return this.userSessionServer.sessionClose$.pipe(
            mergeMap((userSessionId: UserSessionId) => timer(this.userTimeoutPeriod).pipe(
                mapTo(userSessionId),
                takeUntil(this.userSessionServer.socketRegistration$.pipe(
                    filter(({session}) => session.id === userSessionId )
                ))
            ))
        )
    }

    private addUserToGame = (user: UserSession, game: GameSession) => {
        game.addPlayer(user)

        const currentGameSessions = this.sessionsOfUsers.get(user.id)

        if (currentGameSessions) {
            currentGameSessions.push(game)
        } else {
            this.sessionsOfUsers.set(user.id, [game])
        }
    }
    
    private deleteUsersGame = (userId: UserSessionId, game: GameSession) => {
        if (game.playerSessions.find(p => p.id === userId)) {

            game.playerSessions.forEach(p => {
                const playersGames = this.sessionsOfUsers.get(p.id) || []
                this.sessionsOfUsers.set(p.id, playersGames.filter(g => g.id !== game.id))
                if (this.sessionsOfUsers.get(p.id)?.length === 0) {
                    this.sessionsOfUsers.delete(p.id)
                }
            })

            this.gameSessions.delete(game.id)
        }
    }

    private handleNewGame = (userMessage: UserMessage): void => {
        switch(userMessage.payload.gameType) {
            case "randomHuman":

                const waitingUser = this.waitingUserId ? this.userSessionServer.userSessions.get(this.waitingUserId) : undefined
                
                if (waitingUser && waitingUser.id !== userMessage.session.id) {

                    const newGame = new HumanGameSession()
                    this.gameSessions.set(newGame.id, newGame)
                                    
                    this.addUserToGame(userMessage.session, newGame)
                    this.addUserToGame(waitingUser, newGame)
                
                    newGame.playerSessions.forEach(function(session: UserSession): void {
                        session.messageSockets(
                        "CONNECTED game",
                        newGame.currentState
                    )})

                    this.waitingUserId = null
                    this.waitingSockets = []
                } else {
                    this.waitingUserId = userMessage.session.id
                    this.waitingSockets.push(userMessage.socket)
                }
                break
            case "linkedHuman":
                break
            case "computer":
                break
            default:
                break
        }
    }

    private handleDeleteGame = (userMessage: UserMessage): void => {
        switch(userMessage.payload.gameType) {
            case "randomHuman":
                if (this.waitingUserId && this.waitingUserId === userMessage.session.id) {
                    this.waitingSockets = this.waitingSockets.filter(s => s !== userMessage.socket)
                    if (this.waitingSockets.length === 0) {
                        this.waitingUserId = null
                    }
                }
                break
            case "computer":
                break
            default:
                break
        }
    }

    private handleNewGameAction = (userMessage: UserMessage): void => {

        const game = this.gameSessions.get(userMessage?.payload?.gameId)

        if (game && game.playerSessions.find(p => p.id === userMessage.session.id)) {
            switch(userMessage.payload.actionType) {
                case "concede":
                    if (game instanceof HumanGameSession) {
                        game.reportConcession(userMessage.session.id)
                    }
                    this.deleteUsersGame(userMessage.session.id, game)
                    break
                default:
                    break
            }
        }
    }

    private handleSocketDisconnect = (userMessage: UserMessage): void => {
        if (this.waitingUserId && this.waitingUserId === userMessage.session.id) {
            this.waitingSockets = this.waitingSockets.filter(s => s !== userMessage.socket)
            if (this.waitingSockets.length === 0) {
                this.waitingUserId = null
            }
        }
    }

    private handleSocketRegistration = ({ socket, session }: { socket: Socket, session: UserSession }): void => {
        
        const gameSessions = this.sessionsOfUsers.get(session.id)

        socket.emit('CONNECTED user', {
            id: session.id,
            activeGames: gameSessions?.map(s => s.currentState) || [],
            waitingForGame: this.waitingUserId && this.waitingUserId === session.id
        })
    }

    private handleUserSessionClose = (userId: UserSessionId): void => {
        
    }

    private handleUserTimeout = (userId: UserSessionId): void => {

        const usersGames = this.sessionsOfUsers.get(userId) || []

        usersGames.forEach(g => {
            if (g instanceof HumanGameSession) {
                g.reportConcession(userId)
            }

            this.deleteUsersGame(userId, g)
        })
    }
}
