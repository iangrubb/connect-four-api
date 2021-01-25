"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanGameSession = void 0;
const GameSession_1 = require("./GameSession");
class HumanGameSession extends GameSession_1.GameSession {
    constructor() {
        super();
    }
    reportConcession(concedingPlayerId) {
        const opponent = this.playerSessions.find(p => p.id !== concedingPlayerId);
        opponent.messageSockets('UPDATE game', {
            id: this.id, ongoing: false,
            winnerId: opponent.id
        });
    }
}
exports.HumanGameSession = HumanGameSession;
