import GameLogic from "../gameLogic";

interface ActiveUser {
    userId: number,
    socket: any
}

class BaseGameSession {

    allowedUserIds: number[]
    activeUsers: ActiveUser[]
    game: GameLogic

    constructor(moveHistory: number[], allowedUserIds: number[]) {
        this.allowedUserIds = allowedUserIds
        this.game = new GameLogic(moveHistory)
        this.activeUsers = []
    }

    public connectUser(socket: any, userId: number) {
        if (this.allowedUserIds.includes(userId)) {
            this.activeUsers.push({userId, socket})
            return true
        } else {
            return false
        }
    }

    public disconnectUser(userId: number) {
        this.activeUsers = this.activeUsers.filter(user => user.userId !== userId)
    }
}

export default BaseGameSession