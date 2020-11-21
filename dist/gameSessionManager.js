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
const gameSession_1 = __importDefault(require("./gameSessionTypes/gameSession"));
const computerGameConfig_1 = __importDefault(require("./gameSessionTypes/computerGameConfig"));
const gameAI_1 = __importDefault(require("./gameAI"));
class GameSessionManager {
    constructor(io) {
        this.io = io;
        this.activeGamesByUserId = {};
        this.activeGamesByGameId = {};
    }
    addUserToGameSession(userSession, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearUsersGameSession(userSession);
            let gameSession = this.activeGamesByGameId[gameId];
            if (!gameSession) {
                gameSession = yield this.createGameSession(gameId);
            }
            if (!gameSession) {
                this.io.emit("error", "Can't create game session");
            }
            else {
                if (gameSession.connectUser(userSession)) {
                    this.activeGamesByUserId[userSession.userId] = gameSession;
                }
                else {
                    this.io.emit("error", "No access to that game");
                }
            }
        });
    }
    clearUsersGameSession(userSession) {
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
            const gameData = {
                id: gameId,
                moveHistory: [],
                firstUserId: null,
                secondUserId: 1
            };
            // Add data fetching and other cases
            // Add in ability for game session creation to fail, when db lookup finds issue
            // Randomize who goes first, make sure computer initiates the first move if required to do so (should happen when game is made in DB)
            // Checking that data was received
            // if (gameData) {
            // }
            // GameAI.random
            const computerGameConfig = new computerGameConfig_1.default(gameAI_1.default.random);
            const gameSession = new gameSession_1.default(this.io, gameData, computerGameConfig);
            this.activeGamesByGameId[gameId] = gameSession;
            return gameSession;
        });
    }
    deleteGameSessionIfEmpty(session) {
        if (session.activeUsers.length === 0) {
            delete this.activeGamesByGameId[session.gameData.id];
        }
    }
}
exports.default = GameSessionManager;
