
import GameLogic, { GameMove } from '../gameLogic'
import BaseGameSession from './BaseGameSession'

class ComputerGameSession extends BaseGameSession {

    ai: (game: GameLogic) => number

    constructor(io: any, gameId: number, moveHistory: number[], allowedUsers: number[], ai: (game: GameLogic) => number) {
        super(io, gameId, moveHistory, allowedUsers)
        this.ai = ai
    }

    public connectUser(socket: any, userId: number) {

        super.connectUser(socket, userId)

        this.configureEventListeners(socket)

        socket.emit("initial-game-state", this.viewGameState)

        // Add in more user meta data / presence / etc in addition to core game info


        // Handle connection failure, return false in that case
        return true
    }

    public disconnectUser(socket: any, userId: number) {

        // Need this to perform necessary cleanup specific to computer game session?

        super.disconnectUser(socket, userId)

    }

    private configureEventListeners(socket: any) {

        socket.on("new-move", (columnNumber: number) => {

            // Make sure it's actually the player's turn to move

            // Use the game logic to make sure it's a valid columnNumber and that the game isn't over

            if (!this.game.gameStatus.isComplete) {
                this.handleColumnChoice(columnNumber)
            }

            if (!this.game.gameStatus.isComplete) {
                this.scheduleComputerMove()
            }
            
            
        })

        // Give up message can be added later
    }

    private handleColumnChoice(columnNumber: number){
        const newMove = this.game.processMove(columnNumber)
        this.updateAfterMove(newMove)
    }

    private scheduleComputerMove() {
        const delay = 500 + Math.floor(Math.random() * 1000)

        setTimeout(() => {
            const columnNumber = this.ai(this.game)
            this.handleColumnChoice(columnNumber)
        }, delay)
    }

    private updateAfterMove(newMove: GameMove) {
        this.messageRoom("game-update", {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        })
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