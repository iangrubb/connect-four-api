
import { UserSession } from '../sessions/UserSession'
import { UserSessionServer } from './UserSessionServer'
import { UserMessage } from './UserSessionServer'

export class GameSessionServer {

    private waitingUser: UserSession | null = null

    constructor(private userSessionServer: UserSessionServer) {

        this.userSessionServer.userMessage$("POST game").subscribe(this.handleCreateGame)
        this.userSessionServer.userMessage$("CONNECT game").subscribe(this.handleConnectGame)
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleGameAction)
        this.userSessionServer.userDisconnect$.subscribe(console.log)

    }

    handleCreateGame = (userMessage: UserMessage): void => {

    }

    handleConnectGame = (userMessage: UserMessage): void => {

    }

    handleGameAction = (userMessage: UserMessage): void => {
        
    }

}
