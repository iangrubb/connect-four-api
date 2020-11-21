"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __importDefault(require("../gameLogic"));
class BaseGameSession {
    constructor(baseArgs) {
        this.io = baseArgs.io;
        this.allowedUserIds = baseArgs.allowedUserIds;
        this.gameId = baseArgs.gameId;
        this.game = new gameLogic_1.default(baseArgs.moveHistory);
        this.activeUsers = [];
        this.eventMessages = [];
    }
    connectUser(session) {
        if (this.allowedUserIds.includes(session.userId)) {
            session.socket.join(this.gameId);
            this.activeUsers.push(session);
            return true;
        }
        else {
            return false;
        }
    }
    disconnectUser(session) {
        // In multiplayer sessions, we'll broadcast something here regarding player presence
        // If we allow multiple sessions for a user in a game, some care is needed with this.
        session.socket.leave(this.gameId);
        this.activeUsers = this.activeUsers.filter(user => user.userId !== session.userId);
    }
    messageRoom(...args) {
        this.io.to(this.gameId).emit(...args);
    }
    get viewGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        };
    }
}
exports.default = BaseGameSession;
