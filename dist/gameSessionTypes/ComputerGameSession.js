"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseGameSession_1 = __importDefault(require("./BaseGameSession"));
class ComputerGameSession extends BaseGameSession_1.default {
    constructor(io, gameId, moveHistory, allowedUsers, ai) {
        super(io, gameId, moveHistory, allowedUsers);
        this.ai = ai;
    }
    connectUser(socket, userId) {
        super.connectUser(socket, userId);
        this.configureEventListeners(socket);
        socket.emit("initial-game-state", this.viewGameState);
        // Add in more user meta data / presence / etc in addition to core game info
        // Handle connection failure, return false in that case
        return true;
    }
    disconnectUser(socket, userId) {
        // Need this to perform necessary cleanup specific to computer game session?
        super.disconnectUser(socket, userId);
    }
    configureEventListeners(socket) {
        socket.on("new-move", (columnNumber) => {
            // Make sure it's actually the player's turn to move
            // Use the game logic to make sure it's a valid columnNumber and that the game isn't over
            if (!this.game.gameStatus.isComplete) {
                this.handleColumnChoice(columnNumber);
            }
            if (!this.game.gameStatus.isComplete) {
                this.scheduleComputerMove();
            }
        });
        // Give up message can be added later
    }
    handleColumnChoice(columnNumber) {
        const newMove = this.game.processMove(columnNumber);
        this.updateAfterMove(newMove);
    }
    scheduleComputerMove() {
        const delay = 500 + Math.floor(Math.random() * 1000);
        setTimeout(() => {
            const columnNumber = this.ai(this.game);
            this.handleColumnChoice(columnNumber);
        }, delay);
    }
    updateAfterMove(newMove) {
        this.messageRoom("game-update", {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        });
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
