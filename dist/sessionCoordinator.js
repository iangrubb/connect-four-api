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
const ComputerGameSession_1 = __importDefault(require("./gameSessionTypes/ComputerGameSession"));
class SessionCoordinator {
    constructor(io) {
        this.io = io;
        this.activeUsers = {};
        this.activeGames = {};
    }
    processSocket(socket) {
        if (SessionCoordinator.validateSocket(socket)) {
            const userId = SessionCoordinator.socketUserId(socket);
            this.registerUser(userId);
            this.configureGlobalEventListeners(socket);
        }
        else {
            // Send error message
        }
    }
    static validateSocket(socket) {
        // Add validations here (should belong to a valid user)
        // Can a user's account have multiple sockets?
        return true;
    }
    configureGlobalEventListeners(socket) {
        const userId = SessionCoordinator.socketUserId(socket);
        socket.on("join-game", (gameId) => __awaiter(this, void 0, void 0, function* () {
            this.addUserToGameSession(socket, gameId);
        }));
        socket.on("disconnect", () => {
            this.removeUserFromGameSession(socket, userId);
            this.unregisterUser(userId);
        });
    }
    registerUser(userId) {
        this.activeUsers[userId] = { currentGameId: null };
    }
    unregisterUser(userId) {
        delete this.activeUsers[userId];
    }
    createGameSession(gameId) {
        // Test data:
        const moveHistory = [];
        const allowedUserIds = [1];
        // Add data fetching and other cases
        // Add in ability for game session creation to fail, when db lookup finds issue
        const gameSession = new ComputerGameSession_1.default(this.io, gameId, moveHistory, allowedUserIds);
        this.activeGames[gameId] = gameSession;
        return gameSession;
    }
    addUserToGameSession(socket, gameId) {
        const userId = SessionCoordinator.socketUserId(socket);
        let gameSession = this.activeGames[gameId];
        if (!gameSession) {
            gameSession = this.createGameSession(gameId);
        }
        // Consider case where there's a validation error connecting to that game
        gameSession.connectUser(socket, userId);
        this.activeUsers[userId].currentGameId = gameId;
    }
    removeUserFromGameSession(socket, userId) {
        const gameId = this.activeUsers[userId].currentGameId;
        if (gameId) {
            const gameSession = this.activeGames[gameId];
            gameSession.disconnectUser(socket, userId);
            this.activeUsers[userId].currentGameId = null;
            if (gameSession.activeUsers.length === 0) {
                delete this.activeGames[gameId];
            }
        }
    }
    static socketUserId(socket) {
        return parseInt(socket.request._query.userId);
    }
}
exports.default = SessionCoordinator;
