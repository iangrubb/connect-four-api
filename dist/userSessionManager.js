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
const userSession_1 = __importDefault(require("./userSession"));
class UserSessionManager {
    constructor(gameSessionManager) {
        this.gameSessionManager = gameSessionManager;
        this.activeUsers = {};
    }
    initializeSocket(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = UserSessionManager.userIdOfSocket(socket);
            if (userId) {
                const session = yield userSession_1.default.asyncConstructor(userId, socket);
                if (session.valid) {
                    this.registerUser(session);
                    this.configureGlobalEventListeners(session);
                }
                else {
                    socket.emit("error", "Failed authentication");
                }
            }
            else {
                socket.emit("error", "No userId");
            }
        });
    }
    registerUser(session) {
        this.activeUsers[session.userId] = session;
    }
    unregisterUser(session) {
        delete this.activeUsers[session.userId];
    }
    configureGlobalEventListeners(session) {
        session.socket.on("join-game", (gameId) => __awaiter(this, void 0, void 0, function* () {
            this.gameSessionManager.addUserToGameSession(session, gameId);
        }));
        // May need leave game message
        session.socket.on("disconnect", () => {
            this.gameSessionManager.clearUsersGameSession(session);
            this.unregisterUser(session);
        });
    }
    static userIdOfSocket(socket) {
        return parseInt(socket.request._query.userId);
    }
}
exports.default = UserSessionManager;
