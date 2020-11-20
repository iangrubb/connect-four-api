
import { couldStartTrivia } from 'typescript'
import BaseGameSession from './BaseGameSession'

class ComputerGameSession extends BaseGameSession {

    constructor(io: any, gameId: number, moveHistory: number[], allowedUsers: number[]) {
        super(io, gameId, moveHistory, allowedUsers)
    }

    public connectUser(socket: any, userId: number) {

        // Handle connection failure
        super.connectUser(socket, userId)

        this.configureEventListers(socket)

        socket.emit("initial-game-state", this.viewGameState)

        // Add in more user meta data / presence / etc in addition to core game info

        return true
    }

    public disconnectUser(socket: any, userId: number) {

        // Need this to perform necessary cleanup specific to computer game session?

        super.disconnectUser(socket, userId)

    }

    private configureEventListers(socket: any) {

        socket.on("new-move", (columnNumber: number) => {

            const newMove = this.game.processMove(columnNumber)

            const update = {
                newMove,
                validMoves: this.game.validMoves,
                currentPlayer: this.game.currentPlayer,
                gameStatus: this.game.gameStatus
            }

            this.messageRoom("game-update", update)

            // Schedule a new computer move 


        })

        // Give up message can be added later

    }

    private messageRoom(...args: any[]) {
        this.io.to(this.gameId).emit(...args)
    }

    private get viewGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        }
    }
}

export default ComputerGameSession