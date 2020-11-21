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

    public async initializeSocket(socket: any) {
        const userId = UserSessionManager.userIdOfSocket(socket)

        if (userId) {
            const session = await UserSession.asyncConstructor(userId, socket)

            if (session.valid) {
                this.registerUser(session)
                this.configureGlobalEventListeners(session)
            } else {
                socket.emit("error", "Failed authentication")
            }
        } else {
            socket.emit("error", "No userId")
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

        // May need leave game message

        session.socket.on("disconnect", () => {
            this.gameSessionManager.clearUsersGameSession(session)
            this.unregisterUser(session)
        })
    }

    private static userIdOfSocket(socket: any) {
        return parseInt(socket.request._query.userId)
    }
}

export default UserSessionManager