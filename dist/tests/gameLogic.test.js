"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __importDefault(require("../gameLogic"));
describe("tests the Game class", () => {
    test("Game class constructor creates a new game when not given an argument", () => {
        const game = new gameLogic_1.default();
        expect(game.movesHistory).toEqual(expect.arrayContaining([]));
    });
    test("Game class constructor initializes a game from a move list", () => {
        const game = new gameLogic_1.default([0, 3, 2, 0]);
        expect(game.columns).toEqual(expect.arrayContaining([[1, 2], [], [1], [2], [], [], []]));
    });
    test("Game class constructor throws an error on an invalid move number", () => {
        expect(() => {
            new gameLogic_1.default([7]);
        }).toThrow("Valid moves are numbers from 0 to 6");
    });
    test("Game class constructor throws an error on an invalid game history", () => {
        expect(() => {
            new gameLogic_1.default([0, 0, 0, 0, 0, 0, 0]);
        }).toThrow("A column can have at most 6 pieces");
    });
    test("Game class constructor throws an error when it accepts moves after a game would be complete", () => {
        expect(() => {
            new gameLogic_1.default([0, 1, 0, 2, 0, 3, 0, 4]);
        }).toThrow("A completed game can't accept new moves");
    });
    test("Returns the turn number of the current game (1-indexed)", () => {
        const game = new gameLogic_1.default([3, 3]);
        expect(game.turnNumber).toBe(3);
    });
    test("Returns the play order of the current player (1-indexed)", () => {
        const game = new gameLogic_1.default([3, 3]);
        expect(game.currentPlayer).toBe(1);
    });
    test("Columns with six pieces are excluded from the array of valid moves", () => {
        const game = new gameLogic_1.default([0, 0, 0, 0, 0, 0]);
        expect(game.validMoves).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]));
    });
    test("Processing a move adds it to the correct column", () => {
        const game = new gameLogic_1.default([0]);
        game.newMove(0);
        expect(game.columns[0]).toEqual(expect.arrayContaining([1, 2]));
    });
    test("An error is thrown when a new move doesn't reference a valid column", () => {
        const game = new gameLogic_1.default();
        expect(() => {
            game.newMove(-1);
        }).toThrow("Valid moves are numbers from 0 to 6");
    });
    test("An error is thrown when a new move would go in a full column", () => {
        const game = new gameLogic_1.default([0, 0, 0, 0, 0, 0]);
        expect(() => {
            game.newMove(0);
        }).toThrow("A column can have at most 6 pieces");
    });
    test("An error is thrown when a new move is submitted to a completed game", () => {
        const game = new gameLogic_1.default([0, 1, 0, 2, 0, 3, 0]);
        expect(() => {
            game.newMove(4);
        }).toThrow("A completed game can't accept new moves");
    });
    test("A game is marked complete after a winning vertical move", () => {
        const game = new gameLogic_1.default([0, 1, 0, 2, 0, 3]);
        game.newMove(0);
        expect(game.isComplete).toBe(true);
    });
    test("A game is marked complete after a winning horizontal move", () => {
        const game = new gameLogic_1.default([0, 0, 1, 1, 2, 2]);
        game.newMove(3);
        expect(game.isComplete).toBe(true);
    });
    test("A game is marked complete after a winning diagonal move", () => {
        const game = new gameLogic_1.default([0, 1, 1, 2, 2, 3, 2, 3, 3, 6]);
        game.newMove(3);
        expect(game.isComplete).toBe(true);
    });
    test("Processing a move adds it to the game's history", () => {
        const game = new gameLogic_1.default([3]);
        game.newMove(2);
        expect(game.movesHistory[0]).toMatchObject({ player: 1, row: 0, column: 3, turnNumber: 1 });
        expect(game.movesHistory[1]).toMatchObject({ player: 2, row: 0, column: 2, turnNumber: 2 });
    });
    test("An incomplete game is marked as such and has no winner", () => {
        const game = new gameLogic_1.default();
        expect(game.gameStatus.isComplete).toBe(false);
        expect(game.gameStatus.winner).toBeNull();
    });
    test("A complete game is marked as such and has a winner", () => {
        const game = new gameLogic_1.default([0, 0, 1, 1, 2, 2, 3]);
        expect(game.gameStatus.isComplete).toBe(true);
        expect(game.gameStatus.winner).toBe(1);
    });
    test("Can find 4 in a row in an array of values", () => {
        const values = [1, 2, undefined, 1, 1, 1, 1, 2, undefined];
        const result = gameLogic_1.default.findConcentrationInArray(values, 4, 4, 1);
        expect(result).toBeTruthy();
        if (result) {
            expect(result.sequence[0]).toBe(1);
            expect(result.sequence.length).toBe(4);
            expect(result.starting).toBe(3);
        }
    });
});
