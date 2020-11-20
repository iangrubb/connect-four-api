
import GameLogic, { GameMove } from '../gameLogic'
import UserSession from '../userSession'
import BaseGameSession, { BaseArgs } from './baseGameSession'

class ComputerGameSession extends BaseGameSession {

    ai: (game: GameLogic) => number

    constructor(baseArgs: BaseArgs, ai: (game: GameLogic) => number) {
        super(baseArgs)
        this.ai = ai
    }

    public connectUser(session: UserSession) {

        // This could be true or false depending on validity of request
        super.connectUser(session)

        this.configureEventListeners(session)
        session.socket.emit("initial-game-state", this.viewGameState)
        return true
    }

    public disconnectUser(session: UserSession) {

        // Need this to perform necessary cleanup specific to computer game session?

        super.disconnectUser(session)

    }

    private configureEventListeners(session: UserSession) {

        session.socket.on("new-move", (columnNumber: number) => {

            // Make sure it's actually the player's turn to move

            // Use the game logic to make sure it's a valid columnNumber and that the game isn't over

            if (this.validateMove(session.userId, columnNumber)) {
                this.handleColumnChoice(columnNumber)

                if (!this.game.gameStatus.isComplete) {
                    this.scheduleComputerMove()
                }
            }

            
            
            
        })

        // Give up message can be added later
    }

    // Combines game logic and player identity validation, maybe split apart 
    private validateMove(userId: number, columnNumber: number) {
        return (
            !this.game.gameStatus.isComplete
            && this.allowedUserIds.indexOf(userId) + 1 === this.game.currentPlayer
            && this.game.validMoves.includes(columnNumber)
        )   
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

    
}

export default ComputerGameSession