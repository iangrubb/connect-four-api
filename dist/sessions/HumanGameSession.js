"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanGameSession = void 0;
const GameSession_1 = require("./GameSession");
class HumanGameSession extends GameSession_1.GameSession {
    constructor(playerSessions) {
        super(playerSessions);
    }
}
exports.HumanGameSession = HumanGameSession;
