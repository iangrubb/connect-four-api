"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseGameSession_1 = __importDefault(require("./baseGameSession"));
class ComputerGameSession extends baseGameSession_1.default {
    constructor(baseArgs, ai) {
        super(baseArgs);
        this.ai = ai;
    }
    connectUser(session) {
        // This could be true or false depending on validity of request
        super.connectUser(session);
        this.configureEventListeners(session);
        session.socket.emit("initial-game-state", this.viewGameState);
        return true;
    }
    disconnectUser(session) {
        // Need this to perform necessary cleanup specific to computer game session?
        super.disconnectUser(session);
    }
    configureEventListeners(session) {
        session.socket.on("new-move", (columnNumber) => {
            // Make sure it's actually the player's turn to move
            // Use the game logic to make sure it's a valid columnNumber and that the game isn't over
            if (this.validateMove(session.userId, columnNumber)) {
                this.handleColumnChoice(columnNumber);
                if (!this.game.gameStatus.isComplete) {
                    this.scheduleComputerMove();
                }
            }
        });
        // Give up message can be added later
    }
    // Combines game logic and player identity validation, maybe split apart 
    validateMove(userId, columnNumber) {
        return (!this.game.gameStatus.isComplete
            && this.allowedUserIds.indexOf(userId) + 1 === this.game.currentPlayer
            && this.game.validMoves.includes(columnNumber));
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
}
exports.default = ComputerGameSession;
