import { GameState, ColumnNumber } from '../models/GameState'

describe("Tests the GameState class", () => {

    test("The initial game state is incomplete, has a current player of 1, and has an empty pieceMap", () => {
        const game = GameState.initial()
        expect(game.isComplete).toBe(false)
        expect(game.currentPlayer).toBe(1)
        expect(game.pieceCount).toBe(0)
    })

    test("Each incomplete state can return the next state when a valid move is specified", () => {
        const game = GameState.initial().nextState(3).nextState(2).nextState(3)
        expect(game.currentPlayer).toBe(2)
        expect(game.pieceAtCoordinate([3, 1])).toBe(1)
        expect(game.pieceAtCoordinate([2, 0])).toBe(2)
        expect(game.pieceCount).toBe(3)
    })

    test("Game states can be initialized from move histories", () => {
        const game = GameState.fromMoveHistory([3, 2, 3])
        expect(game.currentPlayer).toBe(2)
        expect(game.pieceAtCoordinate([3, 1])).toBe(1)
        expect(game.pieceAtCoordinate([2, 0])).toBe(2)
        expect(game.pieceCount).toBe(3)
    })

    test("The move to advance to the next state must be a valid column number", () => {
        const game = GameState.initial()
        expect(() => game.nextState(7 as ColumnNumber)).toThrow("Invalid Move: not a column")
    })

    test("The move to advance to the next state can't overflow a column", () => {
        const game = GameState.fromMoveHistory([3, 3, 3, 3, 3, 3])
        expect(() => game.nextState(3)).toThrow("Invalid Move: column full")
    })

    test("Valid moves method returns list of available columns", () => {
        const game = GameState.fromMoveHistory([3, 3, 3, 3, 3, 3])
        expect(game.validMoves).toEqual(expect.arrayContaining([0, 1, 2, 4, 5, 6]))
    })

    test("A game is marked complete after a winning vertical move", () => {
        const game = GameState.fromMoveHistory([0, 1, 0, 2, 0, 3]).nextState(0)
        expect(game.isComplete).toBe(true)
    })
    
})