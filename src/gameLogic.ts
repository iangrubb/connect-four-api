export interface GameMove {
    player: number,
    column: number,
    row: number,
    turnNumber: number
}

interface Result {
    sequence: any[],
    starting: number
}

interface Result2 {
    sequence: any[],
    starting: number,
    direction: string,
    idx: number
}

class GameLogic {
    
    movesHistory: GameMove[]
    columns: number[][]
    isComplete: boolean

    constructor(movesHistory: number[] = []){
        this.movesHistory = []
        this.isComplete = false
        this.columns = [[], [], [], [], [], [], []]

        movesHistory.forEach((columnNumber: number) => {
            this.newMove(columnNumber)
        })
    }

    get gameStatus(): {isComplete: boolean, winner: number | null} {
        let winner: number | null
        if (!this.isComplete) {
            winner = null
        } else if (this.currentPlayer === 1) {
            winner = 2
        } else {
            winner = 1
        }
        return {isComplete: this.isComplete, winner}
    }

    get turnNumber(): number {
        return this.movesHistory.length + 1
    }

    get currentPlayer(): number {
        return ((this.turnNumber - 1) % 2) + 1
    }

    get previousPlayer(): number {
        return this.currentPlayer === 1 ? 2 : 1
    }

    get validMoves(): number[] {
        return this.columns
        .map((c, idx) => ({ idx, c }))
        .filter(res => res.c.length < 6)
        .map(res => res.idx)
    }

    isValidMove(columnNumber: number) {
        return !this.gameStatus.isComplete && this.validMoves.includes(columnNumber)
    }

    newMove(columnNumber: number) {
        if (columnNumber < 0 || columnNumber > 6) throw("Valid moves are numbers from 0 to 6")
        if (this.isComplete) throw("A completed game can't accept new moves")
        if (this.columns[columnNumber].length >= 6) throw("A column can have at most 6 pieces")
        
        this.columns[columnNumber].push(this.currentPlayer)

        const newMove = {player: this.currentPlayer, row: this.columns[columnNumber].length - 1, column: columnNumber, turnNumber: this.turnNumber}

        this.movesHistory.push(newMove)
        
        this.checkComplete()

        return newMove
    }

    get rows() {
        const rows: (number | undefined)[][] = [[], [], [], [], [], []]
        this.columns.forEach(column => {
            rows.forEach((row, idx: number) => {
                row.push(column[idx])
            })
        })
        return rows
    }

    get rightDiagonals() {
        const diagonals: (number | undefined)[][] = [[], [], [], [], [], [], [], [], [], [], [], []]

        this.columns.forEach((column, cIdx) => {            
            diagonals.forEach((diagonal, dIdx) => {
                if ( dIdx >= cIdx && dIdx < cIdx + 6 ) {
                    const coordinate = 5 + cIdx - dIdx
                    diagonal.push(column[coordinate])
                }
            })
        })

        return diagonals
    }

    get leftDiagonals() {
        const diagonals: (number | undefined)[][] = [[], [], [], [], [], [], [], [], [], [], [], []]

        this.columns.forEach((column, cIdx) => {            
            diagonals.forEach((diagonal, dIdx) => {
                if ( dIdx >= cIdx && dIdx < cIdx + 6 ) {
                    const coordinate = dIdx - cIdx
                    diagonal.push(column[coordinate])
                }
            })
        })

        return diagonals
    }

    findConcentrations(quantity: number, space: number, player: number): Result2[] {

        if (quantity > space) return []

        let concentrations: Result2[] = []

        for (let idx = 0; idx < this.columns.length; idx++) {
            const column = [...this.columns[idx]] as (number | undefined)[]

            while (column.length < 6) {
                column.push(undefined)
            }

            const result = GameLogic.findConcentrationsInArray(column, quantity, space, player)
            concentrations = concentrations.concat(result.map(r => ({direction: "column", idx, ...r})))
        }

        for (let idx = 0; idx < this.rows.length; idx++) {
            const row = this.rows[idx]
            const result = GameLogic.findConcentrationsInArray(row, quantity, space, player)
            concentrations = concentrations.concat(result.map(r => ({direction: "row", idx, ...r})))
        }

        for (let idx = 0; idx < this.rightDiagonals.length; idx++) {
            const diagonal = this.rightDiagonals[idx]
            const result = GameLogic.findConcentrationsInArray(diagonal, quantity, space, player)
            concentrations = concentrations.concat(result.map(r => ({direction: "rightDiagonal", idx, ...r})))
        }

        for (let idx = 0; idx < this.leftDiagonals.length; idx++) {
            const diagonal = this.leftDiagonals[idx]
            const result = GameLogic.findConcentrationsInArray(diagonal, quantity, space, player)
            concentrations = concentrations.concat(result.map(r => ({direction: "leftDiagonal", idx, ...r})))
        }

        return concentrations
    }
    

    static findConcentrationsInArray(searched: (number | undefined)[], quantity: number, space: number, player: number): Result[] {

        let foundCache: number[] = [0, 0]

        const otherPlayer = player === 1 ? 2 : 1

        const concentrations: Result[] = []

        searched.forEach((val, idx) => {

            if (val) {
                foundCache[val - 1] = foundCache[val - 1] + 1
            }

            if (idx >= space) {
                const prev = searched[idx - space]
                if (prev) {
                    foundCache[prev - 1] = foundCache[prev - 1] - 1
                }   
            }

            if (idx + 1 >= space && foundCache[player - 1] >= quantity && foundCache[otherPlayer - 1] === 0) {
                const starting = idx - space + 1
                concentrations.push({sequence: searched.slice(starting, idx + 1), starting})
            }
        })
        return concentrations
    }

    checkComplete() {

        if (this.validMoves.length === 0) {
            this.isComplete = true
        }

        if (this.findConcentrations(4, 4, this.previousPlayer).length > 0) {
            this.isComplete = true
        }

    }

    
}

export default GameLogic