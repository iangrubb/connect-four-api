import { Socket } from 'socket.io'
import { UserSession, UserSessionId } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'

export class GameSessionServer {

    private waitingUser: UserSession | null = null

    constructor(private userSessionServer: UserSessionServer) {
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame)
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction)
        this.userSessionServer.processedSocketConnect$.subscribe(this.handleSocketConnect)
        this.userSessionServer.processedSessionDisconnect$.subscribe(this.handleUserDisconnect)
    }

    handleNewGame = (userMessage: UserMessage): void => {
        switch(userMessage.payload.gameType) {
            case "randomHuman":
                if (this.waitingUser) {
                    

                    // make and register a new game session of the appropriate type
                    // message users letting them know a new game has started


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

    handleSocketConnect = ({ socket, session }: { socket: Socket, session: UserSession }): void => {
        
    }

    handleUserDisconnect = (userId: UserSessionId): void => {

    }

}
