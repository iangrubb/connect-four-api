"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameAI {
    static random(game) {
        const moveIndex = Math.floor(Math.random() * game.validMoves.length);
        return game.validMoves[moveIndex];
    }
    static basic(game) {
        // Tries to stop you from winning and tries to win itself, otherwise is random.
        const info = game.findConcentration(3, 4, game.previousPlayer);
        console.log(info);
        return GameAI.random(game);
    }
}
exports.default = GameAI;
