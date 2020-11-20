import UserSession from './userSession'
import GameSessionManager from './gameSessionManager'

interface ActiveUsers {
    [key: number]: UserSession;
}

class UserSessionManager {

    gameSessionManager: GameSessionManager
    activeUsers: ActiveUsers

    constructor(gameSessionManager: GameSessionManager) {
        this.gameSessionManager = gameSessionManager
        this.activeUsers = {}
    }

    public async processSocket(socket: any) {

        const userId = UserSessionManager.userIdOfSocket(socket)

        const session = await UserSession.asyncConstructor(userId, socket)

        if (session.valid) {
            this.registerUser(session)
            this.configureGlobalEventListeners(session)
        } else {
            // Send error message
        }
    }

    private registerUser(session: UserSession) {
        this.activeUsers[session.userId] = session
    }

    private unregisterUser(session: UserSession) {
        delete this.activeUsers[session.userId]
    }

    private configureGlobalEventListeners(session: UserSession) {

        session.socket.on("join-game", async (gameId: number)  => {
            this.gameSessionManager.addUserToGameSession(session, gameId)
        })

        session.socket.on("disconnect", () => {
            this.gameSessionManager.removeUserFromGameSession(session)
            this.unregisterUser(session)
        })
    }

    private static userIdOfSocket(socket: any) {
        return parseInt(socket.request._query.userId)
    }
}

export default UserSessionManager