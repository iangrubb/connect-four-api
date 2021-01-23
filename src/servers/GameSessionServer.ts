import { Socket } from 'socket.io'
import { GameSessionId } from '../sessions/GameSession'
import { HumanGameSession } from '../sessions/HumanGameSession'
import { UserSession, UserSessionId } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'

export class GameSessionServer {

    private waitingUser: UserSession | null = null
    private gameSessions: Map<GameSessionId, HumanGameSession> = new Map()

    constructor(private userSessionServer: UserSessionServer) {
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame)
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction)
        this.userSessionServer.socketRegistration$.subscribe(this.handleSocketRegistration)
        this.userSessionServer.sessionClose$.subscribe(this.handleUserSessionClose)
    }

    handleNewGame = (userMessage: UserMessage): void => {
        switch(userMessage.payload.gameType) {
            case "randomHuman":
                if (this.waitingUser && this.waitingUser.id !== userMessage.session.id) {
                    const newGame = new HumanGameSession([userMessage.session, this.waitingUser])
                    
                    this.gameSessions.set(newGame.id, newGame)

                    newGame.playerSessions.forEach((session: UserSession): void => session.messageSockets(
                        "CONNECTED game",
                        newGame.currentState
                    ))

                    this.waitingUser = null
                } else {
                    this.waitingUser = userMessage.session
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

    handleDeleteGame = (userMessage: UserMessage): void => {
        switch(userMessage.payload.gameType) {
            case "randomHuman":
                if (this.waitingUser && this.waitingUser.id === userMessage.session.id) {
                    this.waitingUser = null
                }
                break
            case "computer":
                break
            default:
                break
        }
    }

    handleNewGameAction = (userMessage: UserMessage): void => {

    }

    handleSocketRegistration = ({ socket, session }: { socket: Socket, session: UserSession }): void => {
        
    }

    handleUserSessionClose = (userId: UserSessionId): void => {

    }

}
