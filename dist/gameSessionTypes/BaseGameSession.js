"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __importDefault(require("../gameLogic"));
class BaseGameSession {
    constructor(io, gameId, moveHistory, allowedUserIds) {
        this.io = io;
        this.allowedUserIds = allowedUserIds;
        this.gameId = gameId;
        this.game = new gameLogic_1.default(moveHistory);
        this.activeUsers = [];
    }
    connectUser(socket, userId) {
        socket.join(this.gameId);
        if (this.allowedUserIds.includes(userId)) {
            this.activeUsers.push({ userId, socket });
            return true;
        }
        else {
            return false;
        }
    }
    disconnectUser(socket, userId) {
        // In multiplayer sessions, we'll broadcast something here regarding player presence
        socket.leave(this.gameId);
        this.activeUsers = this.activeUsers.filter(user => user.userId !== userId);
    }
    messageRoom(...args) {
        this.io.to(this.gameId).emit(...args);
    }
}
exports.default = BaseGameSession;
