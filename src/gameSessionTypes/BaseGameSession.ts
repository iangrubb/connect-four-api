import GameLogic from "../gameLogic";

interface ActiveUser {
    userId: number,
    socket: any
}

class BaseGameSession {

    allowedUserIds: number[]
    activeUsers: ActiveUser[]
    game: GameLogic
    gameId: number
    io: any

    constructor(io: any, gameId: number, moveHistory: number[], allowedUserIds: number[]) {
        this.io = io
        this.allowedUserIds = allowedUserIds
        this.gameId = gameId
        this.game = new GameLogic(moveHistory)
        this.activeUsers = []
    }

    public connectUser(socket: any, userId: number) {

        socket.join(this.gameId)

        if (this.allowedUserIds.includes(userId)) {
            this.activeUsers.push({userId, socket})
            return true
        } else {
            return false
        }
    }

    public disconnectUser(socket: any, userId: number) {

        // In multiplayer sessions, we'll broadcast something here regarding player presence
        socket.leave(this.gameId)
        this.activeUsers = this.activeUsers.filter(user => user.userId !== userId)
    }
}

export default BaseGameSession