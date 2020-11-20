import ComputerGameSession from './gameSessionTypes/computerGameSession'

import UserSession from './userSession'

import GameAI from './gameAI'

type GameSession = ComputerGameSession

// Both of these interfaces will eventually have to use their own ids, so that:
    // There can be many userSessions per user. (multiple tabs)
    // There can be many gameSessions per game. (review games)

interface ActiveGamesByUserId {
    [key: number]: GameSession;
}

interface ActiveGamesByGameId {
    [key: number]: GameSession;
}

class GameSessionManager {

    io: any
    activeGamesByUserId: ActiveGamesByUserId
    activeGamesByGameId: ActiveGamesByGameId
    
    constructor(io: any) {
        this.io = io
        this.activeGamesByUserId = {}
        this.activeGamesByGameId = {}
    }
    
    public async addUserToGameSession(session: UserSession, gameId: number) {

        let gameSession = this.activeGamesByGameId[gameId]

        if (!gameSession) {
            gameSession = await this.createGameSession(gameId)
        }

        // Consider case where there's a validation error connecting to that game

        gameSession.connectUser(session)
        this.activeGamesByUserId[session.userId] = gameSession
    }

    public removeUserFromGameSession(userSession: UserSession) {

        const gameSession = this.activeGamesByUserId[userSession.userId]

        if (gameSession) {
            gameSession.disconnectUser(userSession)
            this.deleteGameSessionIfEmpty(gameSession)
            delete this.activeGamesByUserId[userSession.userId]
        }
    }

    private async createGameSession(gameId: number) {

        // Test data:

        const moveHistory: number[] = []

        const allowedUserIds = [1]

        const basicArgs = {io: this.io, gameId, moveHistory, allowedUserIds}

        // Add data fetching and other cases
        // Add in ability for game session creation to fail, when db lookup finds issue

        // Randomize who goes first, make sure computer initiates the first move if required to do so (should happen when game is made in DB)


        const gameSession = new ComputerGameSession(basicArgs, GameAI.random)

        this.activeGamesByGameId[gameId] = gameSession

        return gameSession
    }

    private deleteGameSessionIfEmpty(session: GameSession) {
        if (session.activeUsers.length === 0) {
            delete this.activeGamesByGameId[session.gameId]
        }
    }

    
}

export default GameSessionManager