import GameLogic from "../gameLogic";
import UserSession from "../userSession";

export interface BaseArgs {
    io: any,
    gameId: number,
    moveHistory: number[],
    allowedUserIds: number[]
}

class BaseGameSession {

    allowedUserIds: number[]
    activeUsers: UserSession[]
    game: GameLogic
    gameId: number
    io: any

    constructor(baseArgs: BaseArgs) {
        this.io = baseArgs.io
        this.allowedUserIds = baseArgs.allowedUserIds
        this.gameId = baseArgs.gameId
        this.game = new GameLogic(baseArgs.moveHistory)
        this.activeUsers = []
    }

    public connectUser(session: UserSession) {
        if (this.allowedUserIds.includes(session.userId)) {
            session.socket.join(this.gameId)
            this.activeUsers.push(session)
            return true
        } else {
            return false
        }
    }

    public disconnectUser(session: UserSession) {

        // In multiplayer sessions, we'll broadcast something here regarding player presence
        session.socket.leave(this.gameId)
        this.activeUsers = this.activeUsers.filter(user => user.userId !== session.userId)
    }

    public messageRoom(...args: any[]) {
        this.io.to(this.gameId).emit(...args)
    }

    public get viewGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        }
    }
}

export default BaseGameSession