import { GameState } from '../models/GameState'

describe("Tests the GameState class", () => {

    test("The initial game state is incomplete, has a current player of 1, and has an empty pieceMap", () => {
        const game = new GameState
        expect(game.turnState.complete).toBe(false)
        if (!game.turnState.complete) {
            expect(game.turnState.currentPlayer).toBe(1)
        }

        expect(game.pieceMap.size).toBe(0)
    })
    
})