import GameSession, { GameData } from './gameSessionTypes/gameSession'
import ComputerGameConfig from './gameSessionTypes/computerGameConfig'

import UserSession from './userSession'

import GameAI from './gameAI'

// Both of these interfaces will eventually have to use their own ids, so that:
    // There can be many userSessions per user. (multiple tabs)
    // There can be many gameSessions per game. (review games)

// Make sure we can handle a user joining a game in multiple sessions

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
    
    public async addUserToGameSession(userSession: UserSession, gameId: number) {

        this.clearUsersGameSession(userSession)

        let gameSession = this.activeGamesByGameId[gameId]

        if (!gameSession) {
            gameSession = await this.createGameSession(gameId)
        }

        if (!gameSession) {
            this.io.emit("error", "Can't create game session")
        } else {
            if (gameSession.connectUser(userSession)) {
                this.activeGamesByUserId[userSession.userId] = gameSession
            } else {
                this.io.emit("error", "No access to that game")
            }
        }
    }

    public clearUsersGameSession(userSession: UserSession) {

        const gameSession = this.activeGamesByUserId[userSession.userId]

        if (gameSession) {
            gameSession.disconnectUser(userSession)
            this.deleteGameSessionIfEmpty(gameSession)
            delete this.activeGamesByUserId[userSession.userId]
        }
    }

    private async createGameSession(gameId: number) {

        const gameData: GameData = {
            id: gameId,
            moveHistory: [],
            firstUserId: null,
            secondUserId: 1
        }

        // Add data fetching and other cases
        // Add in ability for game session creation to fail, when db lookup finds issue

        // Randomize who goes first, make sure computer initiates the first move if required to do so (should happen when game is made in DB)


        // Checking that data was received

        // if (gameData) {


        // }


        // GameAI.random

        const computerGameConfig = new ComputerGameConfig(GameAI.basic)

        const gameSession = new GameSession(this.io, gameData, computerGameConfig)





        this.activeGamesByGameId[gameId] = gameSession

        return gameSession
    }

    private deleteGameSessionIfEmpty(session: GameSession) {
        if (session.activeUsers.length === 0) {
            delete this.activeGamesByGameId[session.gameData.id]
        }
    }

    
}

export default GameSessionManager