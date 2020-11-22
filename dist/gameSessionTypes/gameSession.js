"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameLogic_1 = __importDefault(require("../gameLogic"));
class GameSession {
    constructor(io, gameData, eventConfig) {
        this.io = io;
        this.game = new gameLogic_1.default(gameData.moveHistory);
        this.gameData = gameData;
        this.activeUsers = [];
        this.eventConfig = eventConfig;
    }
    connectUser(session) {
        if (this.gameData.firstUserId === session.userId || this.gameData.secondUserId === session.userId) {
            this.eventConfig.apply(session, this);
            session.socket.join(this.gameData.id);
            this.sendGameState();
            if (this.eventConfig.onConnected) {
                this.eventConfig.onConnected(session, this);
            }
            this.activeUsers.push(session);
            return true;
        }
        else {
            return false;
        }
    }
    disconnectUser(session) {
        this.eventConfig.remove();
        // In multiplayer sessions, we'll broadcast something here regarding player presence
        // If we allow multiple sessions for a user in a game, some care is needed with this.
        session.socket.leave(this.gameData.id);
        this.activeUsers = this.activeUsers.filter(user => user.userId !== session.userId);
    }
    messageRoom(...args) {
        this.io.to(this.gameData.id).emit(...args);
    }
    processMoveRequest(columnNumber) {
        const newMove = this.game.newMove(columnNumber);
        this.sendUpdateForMove(newMove);
    }
    sendGameState() {
        this.messageRoom("initial-game-state", {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        });
    }
    sendUpdateForMove(newMove) {
        this.messageRoom("game-update", {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        });
    }
}
exports.default = GameSession;
