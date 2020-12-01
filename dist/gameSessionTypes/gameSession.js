"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const gameLogic_1 = __importDefault(require("../gameLogic"));
class GameSession {
    constructor(gameData, actionCallbacks, updateCallbacks) {
        this.game = new gameLogic_1.default(gameData.moveHistory);
        this.gameData = gameData;
        this.gameUpdate$ = new rxjs_1.Subject();
        this.actionCallbacks = actionCallbacks;
        this.updateCallbacks = updateCallbacks;
        this.gameUpdate$.subscribe(update => this.handleUpdate(update));
        this.gameUpdate$.next({ message: "initialized" });
    }
    handleAction(client, action) {
        this.actionCallbacks[action.message](this, client, action);
    }
    handleUpdate(update) {
        this.updateCallbacks[update.message](this, update);
    }
    validateUser(userId) {
        return this.gameData.validUsers.includes(userId);
    }
    get activeUser() {
        return this.game.currentPlayer === 1 ? this.gameData.firstUserId : this.gameData.secondUserId;
    }
    processMove(columnNumber) {
        const newMove = this.game.newMove(columnNumber);
        this.gameUpdate$.next({ message: "new-move", payload: newMove });
    }
    get serializedGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        };
    }
    serializeMove(newMove) {
        return {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        };
    }
}
exports.default = GameSession;
