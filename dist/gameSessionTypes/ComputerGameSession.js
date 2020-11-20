"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseGameSession_1 = __importDefault(require("./BaseGameSession"));
class ComputerGameSession extends BaseGameSession_1.default {
    constructor(io, gameId, moveHistory, allowedUsers) {
        super(io, gameId, moveHistory, allowedUsers);
    }
    connectUser(socket, userId) {
        // Handle connection failure
        super.connectUser(socket, userId);
        this.configureEventListers(socket);
        socket.emit("initial-game-state", this.viewGameState);
        // Add in more user meta data / presence / etc in addition to core game info
        return true;
    }
    disconnectUser(socket, userId) {
        // Need this to perform necessary cleanup specific to computer game session?
        super.disconnectUser(socket, userId);
    }
    configureEventListers(socket) {
        socket.on("new-move", (columnNumber) => {
            const newMove = this.game.processMove(columnNumber);
            const update = {
                newMove,
                validMoves: this.game.validMoves,
                currentPlayer: this.game.currentPlayer,
                gameStatus: this.game.gameStatus
            };
            this.messageRoom("game-update", update);
            // Schedule a new computer move 
        });
        // Give up message can be added later
    }
    messageRoom(...args) {
        this.io.to(this.gameId).emit(...args);
    }
    get viewGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        };
    }
}
exports.default = ComputerGameSession;
