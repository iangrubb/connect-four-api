"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __importDefault(require("../gameLogic"));
class BaseGameSession {
    constructor(moveHistory, allowedUserIds) {
        this.allowedUserIds = allowedUserIds;
        this.game = new gameLogic_1.default(moveHistory);
        this.activeUsers = [];
    }
    connectUser(socket, userId) {
        if (this.allowedUserIds.includes(userId)) {
            this.activeUsers.push({ userId, socket });
            return true;
        }
        else {
            return false;
        }
    }
    disconnectUser(userId) {
        this.activeUsers = this.activeUsers.filter(user => user.userId !== userId);
    }
}
exports.default = BaseGameSession;
