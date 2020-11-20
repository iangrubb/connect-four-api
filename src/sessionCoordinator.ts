import ComputerGameSession from './gameSessionTypes/ComputerGameSession'

import GameAI from './gameAI'

// The keys on ActiveGames will eventually have to be something besides gameIds, since two players can review their multiplayer game separately



// Maybe split this into two classes, one to manage users and one to manage games

interface ActiveGames {
    [key: number]: ComputerGameSession;
}

interface UserRecord {
    currentGameId: number | null;
}

interface ActiveUsers {
    [key: number]: UserRecord;
}

class SessionCoordinator {

    activeUsers: ActiveUsers
    activeGames: ActiveGames
    io: any

    constructor(io: any) {
        this.io = io
        this.activeUsers = {}
        this.activeGames = {}
    }

    public processSocket(socket: any) {

        if (SessionCoordinator.validateSocket(socket)) {
            const userId = SessionCoordinator.socketUserId(socket)
            this.registerUser(userId)
            this.configureGlobalEventListeners(socket)
        } else {
            // Send error message
        }
    }

    private static validateSocket(socket: any) {
        // Add validations here (should belong to a valid user)

        // Can a user's account have multiple sockets?
        return true
    }

    private configureGlobalEventListeners(socket: any) {
        const userId = SessionCoordinator.socketUserId(socket)

        socket.on("join-game", async (gameId: number)  => {
            this.addUserToGameSession(socket, gameId)
        })

        socket.on("disconnect", () => {
            this.removeUserFromGameSession(socket, userId)
            this.unregisterUser(userId)
        })
    }

    private registerUser(userId: number) {
        this.activeUsers[userId] = {currentGameId: null}
    }

    private unregisterUser(userId: number) {
        delete this.activeUsers[userId]
    }

    private createGameSession(gameId: number) {

        // Test data:

        const moveHistory: number[] = []

        const allowedUserIds = [1]


        // Add data fetching and other cases
        // Add in ability for game session creation to fail, when db lookup finds issue


        // Randomize who goes first, make sure computer initiates the first move if required to do so


        // Plug in AI here, make choice about which based on stored game difficulty

        const gameSession = new ComputerGameSession(this.io, gameId, moveHistory, allowedUserIds, GameAI.random)

        this.activeGames[gameId] = gameSession

        return gameSession
    }

    private addUserToGameSession(socket: any, gameId: number) {

        const userId = SessionCoordinator.socketUserId(socket)

        let gameSession = this.activeGames[gameId]

        if (!gameSession) {
            gameSession = this.createGameSession(gameId)
        }

        // Consider case where there's a validation error connecting to that game
        gameSession.connectUser(socket, userId)
        this.activeUsers[userId].currentGameId = gameId
    }

    private removeUserFromGameSession(socket: any, userId: number) {

        const gameId = this.activeUsers[userId].currentGameId

        if (gameId) {
            const gameSession = this.activeGames[gameId]
            gameSession.disconnectUser(socket, userId)
            this.activeUsers[userId].currentGameId = null

            if (gameSession.activeUsers.length === 0) {
                delete this.activeGames[gameId]
            }
        }
    }

    private static socketUserId(socket: any): number {
        return parseInt(socket.request._query.userId)
    }
}

export default SessionCoordinator