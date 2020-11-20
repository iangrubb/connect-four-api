"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const computerGameSession_1 = __importDefault(require("./gameSessionTypes/computerGameSession"));
const gameAI_1 = __importDefault(require("./gameAI"));
class GameSessionManager {
    constructor(io) {
        this.io = io;
        this.activeGamesByUserId = {};
        this.activeGamesByGameId = {};
    }
    addUserToGameSession(session, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            let gameSession = this.activeGamesByGameId[gameId];
            if (!gameSession) {
                gameSession = yield this.createGameSession(gameId);
            }
            // Consider case where there's a validation error connecting to that game
            gameSession.connectUser(session);
            this.activeGamesByUserId[session.userId] = gameSession;
        });
    }
    removeUserFromGameSession(userSession) {
        const gameSession = this.activeGamesByUserId[userSession.userId];
        if (gameSession) {
            gameSession.disconnectUser(userSession);
            this.deleteGameSessionIfEmpty(gameSession);
            delete this.activeGamesByUserId[userSession.userId];
        }
    }
    createGameSession(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Test data:
            const moveHistory = [];
            const allowedUserIds = [1];
            const basicArgs = { io: this.io, gameId, moveHistory, allowedUserIds };
            // Add data fetching and other cases
            // Add in ability for game session creation to fail, when db lookup finds issue
            // Randomize who goes first, make sure computer initiates the first move if required to do so (should happen when game is made in DB)
            const gameSession = new computerGameSession_1.default(basicArgs, gameAI_1.default.random);
            this.activeGamesByGameId[gameId] = gameSession;
            return gameSession;
        });
    }
    deleteGameSessionIfEmpty(session) {
        if (session.activeUsers.length === 0) {
            delete this.activeGamesByGameId[session.gameId];
        }
    }
}
exports.default = GameSessionManager;
