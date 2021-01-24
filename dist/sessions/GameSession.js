"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const GameState_1 = require("../models/GameState");
const uuid_1 = require("uuid");
class GameSession {
    constructor() {
        this.id = uuid_1.v4();
        this.gameState = GameState_1.GameState.initial();
        this.playerSessions = [];
    }
    get currentState() {
        return { id: this.id };
    }
    addPlayer(playerSession) {
        this.playerSessions.push(playerSession);
    }
}
exports.GameSession = GameSession;
