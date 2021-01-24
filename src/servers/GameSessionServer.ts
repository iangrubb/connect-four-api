import { Socket } from 'socket.io'
import { GameSessionId, GameSession } from '../sessions/GameSession'
import { HumanGameSession } from '../sessions/HumanGameSession'
import { UserSession, UserSessionId } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'

export class GameSessionServer {

    private waitingUserId: UserSessionId | null = null
    private gameSessions: Map<GameSessionId, GameSession> = new Map()
    private sessionsOfUsers: Map<UserSessionId, GameSession[]> = new Map()

    constructor(private userSessionServer: UserSessionServer) {
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame)
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction)
        this.userSessionServer.socketRegistration$.subscribe(this.handleSocketRegistration)
        this.userSessionServer.sessionClose$.subscribe(this.handleUserSessionClose)
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
    
    private removeUserFromGame = () => {

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
                } else {
                    this.waitingUserId = userMessage.session.id
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
                    this.waitingUserId = null
                }
                break
            case "computer":
                break
            default:
                break
        }
    }

    private handleNewGameAction = (userMessage: UserMessage): void => {

    }

    private handleSocketRegistration = ({ socket, session }: { socket: Socket, session: UserSession }): void => {
        
        const gameSessions = this.sessionsOfUsers.get(session.id)

        socket.emit('CONNECTED user', {
            id: session.id,
            gameSessionIds: gameSessions?.map(s => s.id) || [],
            waitingForGame: this.waitingUserId && this.waitingUserId === session.id
        })
    }

    private handleUserSessionClose = (userId: UserSessionId): void => {
        
    }

}
