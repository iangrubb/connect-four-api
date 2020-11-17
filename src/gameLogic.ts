class GameLogic {
    
    moveHistory: number[]
    columns: number[][]
    isComplete: boolean

    constructor(moveHistory: number[] = []){

        this.moveHistory = moveHistory
        this.isComplete = false
        this.columns = [[], [], [], [], [], [], []]
        moveHistory.forEach((columnNumber: number) => {
            this.processMove(columnNumber)
        })

    }

    get gameStatus(): {isComplete: boolean, winner: number | null} {

    }

    get turnNumber(): number {
        return this.moveHistory.length + 1
    }

    get currentPlayer(): number {
        return ((this.turnNumber - 1) % 2) + 1
    }

    get validMoves(): number[] {
        return this.columns.filter(c => c.length < 6).map((c, idx) => idx)
    }

    checkComplete() {

    }

    processMove(columnNumber: number) {

    }

}

export default Game