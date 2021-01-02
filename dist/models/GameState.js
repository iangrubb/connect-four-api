"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const immutable_1 = require("immutable");
class GameState {
    constructor() {
        this.turnState = { complete: false, currentPlayer: 1 };
        this.pieceMap = immutable_1.Map();
    }
    static initial() {
        return new GameState();
    }
}
exports.GameState = GameState;
