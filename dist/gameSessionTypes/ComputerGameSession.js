"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseGameSession_1 = __importDefault(require("./BaseGameSession"));
class ComputerGameSession extends BaseGameSession_1.default {
    constructor(moveHistory, allowedUsers) {
        super(moveHistory, allowedUsers);
    }
    connectUser(socket, userId) {
        super.connectUser(socket, userId);
        return false;
    }
    disconnectUser(userId) {
        super.disconnectUser(userId);
        // Need this to perform necessary cleanup specific to computer game session?
    }
}
exports.default = ComputerGameSession;
