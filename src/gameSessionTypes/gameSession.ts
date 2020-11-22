import GameLogic, { GameMove } from "../gameLogic";
import UserSession from "../userSession";

// Enforce that eventConfig has an apply method and a remove method

// Maybe also an onConnected callback

export interface GameData {
    id: number,
    moveHistory: number[],
    firstUserId: number | null,
    secondUserId: number | null
}

class GameSession {

    io: any
    game: GameLogic
    gameData: GameData
    activeUsers: UserSession[]
    eventConfig: any

    constructor(io: any, gameData: GameData, eventConfig: any) {
        this.io = io
        this.game = new GameLogic(gameData.moveHistory)
        this.gameData = gameData
        this.activeUsers = []
        this.eventConfig = eventConfig
    }

    public connectUser(session: UserSession) {
        if (this.gameData.firstUserId === session.userId || this.gameData.secondUserId === session.userId) {

            this.eventConfig.apply(session, this)
            session.socket.join(this.gameData.id)
            this.sendGameState()

            if (this.eventConfig.onConnected) {
                this.eventConfig.onConnected(session, this)
            }
            
            this.activeUsers.push(session)

            return true
        } else {
            return false
        }
    }

    public disconnectUser(session: UserSession) {
        this.eventConfig.remove()
        // In multiplayer sessions, we'll broadcast something here regarding player presence
        // If we allow multiple sessions for a user in a game, some care is needed with this.
        session.socket.leave(this.gameData.id)
        this.activeUsers = this.activeUsers.filter(user => user.userId !== session.userId)
    }

    public messageRoom(...args: any[]) {
        this.io.to(this.gameData.id).emit(...args)
    }

    public processMoveRequest(columnNumber: number) {
        const newMove = this.game.newMove(columnNumber)
        this.sendUpdateForMove(newMove)
    }

    public sendGameState() {
        this.messageRoom("initial-game-state", {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        })
    }

    public sendUpdateForMove(newMove: GameMove) {
        this.messageRoom("game-update", {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        })
    }
}

export default GameSession