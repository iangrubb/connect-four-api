import { GridMap, Coordinate, Direction } from './GridMap'

type PlayerId = 1 | 2

export type ColumnNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

const columnNumbers = [0, 1, 2, 3, 4, 5, 6] as ColumnNumber[]

type RowNumber = 0 | 1 | 2 | 3 | 4 | 5

const rowNumbers = [0, 1, 2, 3, 4, 5] as RowNumber[]

export class GameState {

    static initial(): GameState {
        return new GameState(new GridMap(), false, 1, null)
    }

    static fromMoveHistory(moveHistory: ColumnNumber[]): GameState {
        let gameState = GameState.initial()

        for (let move of moveHistory) {
            gameState = gameState.nextState(move)
        }

        return gameState
    }

    private constructor (
        private pieceMap: GridMap<PlayerId>,
        private _complete: boolean,
        private _currentPlayer: PlayerId,
        private _winner: PlayerId | null
    ) {}

    get complete(): boolean {
        return this._complete
    }

    get currentPlayer(): PlayerId {
        return this._currentPlayer
    }

    get nextPlayer(): PlayerId {
        return this.currentPlayer === 1 ? 2 : 1
    }

    get winner(): PlayerId | null {
        return this._winner
    }

    get pieceCount(): number {
        return this.pieceMap.size
    }

    get validMoves(): ColumnNumber[] {
        if (this.complete) {
            return []
        } else {
            return columnNumbers.filter(c => !this.pieceAtCoordinate([c, 5]))
        }
    }

    pieceAtCoordinate(coordinate: Coordinate): PlayerId | null {
        return this.pieceMap.get(coordinate)
    }

    nextState(columnNumber: ColumnNumber): GameState {

        const rowNumber = this.getRowForValidColumn(columnNumber)

        const newPieceMap = this.pieceMap.set([columnNumber, rowNumber], this.currentPlayer)

        if (this.hasCompletingMoveAt([columnNumber, rowNumber])) {
            return new GameState(newPieceMap, true, this.nextPlayer, this.currentPlayer)
        } else if (newPieceMap.size === 42) {
            return new GameState(newPieceMap, true, this.nextPlayer, null)
        } else {
            return new GameState(newPieceMap, false, this.nextPlayer, null)
        }
    }

    private getRowForValidColumn(columnNumber: ColumnNumber): RowNumber {
        if (columnNumber < 0 || columnNumber > 6) { throw("Invalid Move: not a column") }

        if (this.complete) { throw("Invalid Move: game complete") }
    
        const rowNumber = rowNumbers.find(r => this.pieceAtCoordinate([columnNumber, r]) === null)

        if (!rowNumber && rowNumber !== 0) { throw("Invalid Move: column full") }

        return rowNumber
    }

    private hasCompletingMoveAt(coordinate: Coordinate): boolean {

        const adjacencyDetails = this.pieceMap.takeNeighborsWhile(coordinate, (value: PlayerId | null): boolean => value === this.currentPlayer)
        
        const directionPairs: [Direction, Direction][] = [["up", "down"], ["left", "right"], ["upLeft", "downRight"], ["downLeft", "upRight"]] 

        return directionPairs.some(([dir1, dir2]) => adjacencyDetails[dir1].length + adjacencyDetails[dir2].length >= 3)
    }
}