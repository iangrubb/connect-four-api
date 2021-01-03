import { Map } from 'immutable'

type PlayerId = 1 | 2

export type ColumnNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

const columnNumbers = [0, 1, 2, 3, 4, 5, 6] as ColumnNumber[]

type RowNumber = 0 | 1 | 2 | 3 | 4 | 5

const rowNumbers = [0, 1, 2, 3, 4, 5] as RowNumber[]

type Coordinate = [ColumnNumber, RowNumber]

type TurnState = {complete: false, currentPlayer: PlayerId} | {complete: true, winningPlayer: PlayerId | null}

type PieceMap = Map<string, PlayerId>

type Direction = "up" | "upRight" | "right" | "downRight" | "down" | "downLeft" | "left" | "upLeft"

type AdjacencyInfo = {
    [key in Direction]: (PlayerId | null)[]
}

const keyFromCoordinate = (coordinate: Coordinate) => {
    const [x, y] = coordinate
    return `${x}${y}`
}

export class GameState {

    private constructor (private pieceMap: PieceMap, private turnState: TurnState) {}

    get isComplete(): boolean {
        return this.turnState.complete
    }

    get currentPlayer(): PlayerId | null {
        return this.turnState.complete ? null : this.turnState.currentPlayer
    }

    get winningPlayer(): PlayerId | null {
        return this.turnState.complete ? this.turnState.winningPlayer : null
    }

    get pieceCount(): number {
        return this.pieceMap.size
    }

    get validMoves(): ColumnNumber[] {
        if (this.turnState.complete) {
            return []
        } else {
            return columnNumbers.filter(c => !this.pieceAtCoordinate([c, 5]))
        }
    }

    pieceAtCoordinate(coordinate: Coordinate): PlayerId | null {
        return this.pieceMap.get(keyFromCoordinate(coordinate), null)
    }

    traverseDirectionFor(coordinate: Coordinate, dx: number, dy: number, includedValues: (PlayerId | null)[] ): (PlayerId | null)[] {

        const viewed: (PlayerId | null)[] = []

        let [x, y] = coordinate

        x += dx
        y += dy

        while( x >= 0 && y >= 0 && x < 7 && y < 6) {

            let targetElement = this.pieceAtCoordinate([x as ColumnNumber, y as RowNumber])

            if (includedValues.includes(targetElement)) {
                viewed.push(targetElement)
                x += dx
                y += dy
            } else {
                return viewed
            }
        }

        return viewed
    }

    adjacentSequences(coordinate: Coordinate, includedValues: (PlayerId | null)[]): AdjacencyInfo {
        return {
            up: this.traverseDirectionFor(coordinate, 0, 1, includedValues),
            upRight: this.traverseDirectionFor(coordinate, 1, 1, includedValues),
            right: this.traverseDirectionFor(coordinate, 1, 0, includedValues),
            downRight: this.traverseDirectionFor(coordinate, 1, -1, includedValues),
            down: this.traverseDirectionFor(coordinate, 0, -1, includedValues),
            downLeft: this.traverseDirectionFor(coordinate, -1, -1, includedValues),
            left: this.traverseDirectionFor(coordinate, -1, 0, includedValues),
            upLeft: this.traverseDirectionFor(coordinate, -1, 1, includedValues),
        }
    }

    hasCompletingMove(coordinate: Coordinate): boolean {

        const adjacencyDetails = this.adjacentSequences(coordinate, [this.currentPlayer])

        const directionPairs: [Direction, Direction][] = [["up", "down"], ["left", "right"], ["upLeft", "downRight"], ["downLeft", "upRight"]] 

        return directionPairs.some(([dir1, dir2]) => adjacencyDetails[dir1].length + adjacencyDetails[dir2].length >= 3)
    }

    nextState(columnNumber: ColumnNumber): GameState {

        if (columnNumber < 0 || columnNumber > 6) { throw("Invalid Move: not a column") }

        if (this.turnState.complete) { throw("Invalid Move: game complete") }
    
        const rowNumber = rowNumbers.find(r => !this.pieceAtCoordinate([columnNumber, r]))

        if (!rowNumber && rowNumber !== 0) { throw("Invalid Move: column full") }

        const newPieceMap = this.pieceMap.set(keyFromCoordinate([columnNumber, rowNumber]), this.currentPlayer as PlayerId)

        if (this.hasCompletingMove([columnNumber, rowNumber])) {
            return new GameState(newPieceMap, {complete: true, winningPlayer: this.currentPlayer})
        } else {
            return new GameState(newPieceMap, {complete: false, currentPlayer: this.currentPlayer === 1 ? 2 : 1})
        }
        
    }

    static initial(): GameState {
        return new GameState(Map(), {complete: false, currentPlayer: 1})
    }

    static fromMoveHistory(moveHistory: ColumnNumber[]): GameState {

        let gameState = GameState.initial()

        for (let move of moveHistory) {
            gameState = gameState.nextState(move)
        }

        return gameState
    }
}