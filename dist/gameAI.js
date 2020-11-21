"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameAI {
    static random(game) {
        const moveIndex = Math.floor(Math.random() * game.validMoves.length);
        return game.validMoves[moveIndex];
    }
}
exports.default = GameAI;
