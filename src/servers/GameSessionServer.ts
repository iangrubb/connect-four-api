import { Socket } from 'socket.io'
import { UserSession, UserSessionId } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'

export class GameSessionServer {

    private waitingUser: UserSession | null = null

    constructor(private userSessionServer: UserSessionServer) {
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction)
        this.userSessionServer.processedSocketConnect$.subscribe(this.handleSocketConnect)
        this.userSessionServer.processedSessionDisconnect$.subscribe(this.handleUserDisconnect)
    }

    handleNewGame = (userMessage: UserMessage): void => {

    }

    handleNewGameAction = (userMessage: UserMessage): void => {

    }

    handleSocketConnect = ({ socket, session }: { socket: Socket, session: UserSession }): void => {
        
    }

    handleUserDisconnect = (userId: UserSessionId): void => {

    }

}
