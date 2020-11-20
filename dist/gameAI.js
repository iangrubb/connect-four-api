"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameAI {
    static random(game) {
        GameAI.checkComplete(game);
        const moveIndex = Math.floor(Math.random() * game.validMoves.length);
        return game.validMoves[moveIndex];
    }
    static checkComplete(game) {
        if (game.isComplete)
            throw ("AI can't recommend a move for a completed game");
    }
}
exports.default = GameAI;
