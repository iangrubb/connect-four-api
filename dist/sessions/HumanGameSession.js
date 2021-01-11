"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumanGameSession = void 0;
const GameState_1 = require("../models/GameState");
const uuid_1 = require("uuid");
class HumanGameSession {
    constructor(playerSessions) {
        this.playerSessions = playerSessions;
        this.id = uuid_1.v4();
        this.gameState = GameState_1.GameState.initial();
    }
    get currentState() {
        return { id: this.id };
    }
}
exports.HumanGameSession = HumanGameSession;
