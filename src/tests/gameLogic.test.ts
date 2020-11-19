import GameLogic from '../gameLogic'

describe("tests the Game class", ()=>{

    test("Game class constructor creates a new game when not given an argument", () => {
        const game = new GameLogic()
        expect(game.movesHistory).toEqual(expect.arrayContaining([]))
    })

    test("Game class constructor initializes a game from a move list", () => {
        const game = new GameLogic([0, 3, 2, 0])
        expect(game.columns).toEqual(expect.arrayContaining([[1, 2], [], [1], [2], [], [], []]))
    })

    test("Game class constructor throws an error on an invalid move number", () => {
        expect(() => {
            new GameLogic([7])
        }).toThrow("Valid moves are numbers from 0 to 6")
    })

    test("Game class constructor throws an error on an invalid game history", () => {
        expect(() => {
            new GameLogic([0, 0, 0, 0, 0, 0, 0])
        }).toThrow("A column can have at most 6 pieces")
    })

    test("Game class constructor throws an error when it accepts moves after a game would be complete", () => {
        expect(()=>{
            new GameLogic([0, 1, 0, 2, 0, 3, 0, 4])
        }).toThrow("A completed game can't accept new moves")
    })

    test("Returns the turn number of the current game (1-indexed)", ()=> {
        const game = new GameLogic([3, 3])
        expect(game.turnNumber).toBe(3)
    })

    test("Returns the play order of the current player (1-indexed)", ()=>{
        const game = new GameLogic([3, 3])
        expect(game.currentPlayer).toBe(1)
    })

    test("Columns with six pieces are excluded from the array of valid moves", ()=>{
        const game = new GameLogic([0, 0, 0, 0, 0, 0])
        expect(game.validMoves).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]))
    })

    test("Processing a move adds it to the correct column", () => {
        const game = new GameLogic([0])
        game.processMove(0)
        expect(game.columns[0]).toEqual(expect.arrayContaining([1, 2]))
    })

    test("An error is thrown when a new move doesn't reference a valid column", ()=>{
        const game = new GameLogic()
        expect(()=>{
            game.processMove(-1)
        }).toThrow("Valid moves are numbers from 0 to 6")
    })

    test("An error is thrown when a new move would go in a full column", ()=>{
        const game = new GameLogic([0, 0, 0, 0, 0, 0])
        expect(()=>{
            game.processMove(0)
        }).toThrow("A column can have at most 6 pieces")
    })

    test("An error is thrown when a new move is submitted to a completed game", ()=>{
        const game = new GameLogic([0, 1, 0, 2, 0, 3, 0])
        expect(()=>{
            game.processMove(4)
        }).toThrow("A completed game can't accept new moves")
    })

    test("A game is marked complete after a winning vertical move", () => {
        const game = new GameLogic([0, 1, 0, 2, 0, 3])
        game.processMove(0)
        expect(game.isComplete).toBe(true)
    })

    test("A game is marked complete after a winning horizontal move", () => {
        const game = new GameLogic([0, 0, 1, 1, 2, 2])
        game.processMove(3)
        expect(game.isComplete).toBe(true)
    })

    test("A game is marked complete after a winning diagonal move", () => {
        const game = new GameLogic([0, 1, 1, 2, 2, 3, 2, 3, 3, 6])
        game.processMove(3)
        expect(game.isComplete).toBe(true)
    })

    test("Processing a move adds it to the game's history", () => {
        const game = new GameLogic([3])
        game.processMove(2)
        expect(game.movesHistory[0]).toEqual(3)
        expect(game.movesHistory[1]).toEqual(2)

    })

    test("An incomplete game is marked as such and has no winner", () => {
        const game = new GameLogic()
        expect(game.gameStatus.isComplete).toBe(false)
        expect(game.gameStatus.winner).toBeNull()
    })

    test("A complete game is marked as such and has a winner", () => {
        const game = new GameLogic([0, 0, 1, 1, 2, 2, 3])
        expect(game.gameStatus.isComplete).toBe(true)
        expect(game.gameStatus.winner).toBe(1)
    })

})

