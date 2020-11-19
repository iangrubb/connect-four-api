
import BaseGameSession from './BaseGameSession'

class ComputerGameSession extends BaseGameSession {

    constructor(moveHistory: number[], allowedUsers: number[]) {
        super(moveHistory, allowedUsers)
    }

    public connectUser(socket: any, userId: number) {

        super.connectUser(socket, userId)

        return false
    }

    public disconnectUser(userId: number) {

        super.disconnectUser(userId)

        // Need this to perform necessary cleanup specific to computer game session?
    }

}

export default ComputerGameSession