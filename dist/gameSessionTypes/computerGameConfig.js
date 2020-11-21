"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ComputerGameConfig {
    constructor(ai) {
        this.ai = ai;
        this.removeCallback = null;
    }
    apply(userSession, gameSession) {
        const handleNewMove = (columnNumber) => {
            if (this.isValidSubmission(userSession, gameSession) && gameSession.game.isValidMove(columnNumber)) {
                this.processMove(gameSession, columnNumber);
                if (!gameSession.game.isComplete) {
                    this.scheduleComputerMove(gameSession);
                }
            }
        };
        // Give up message can be added later
        userSession.socket.on("new-move", handleNewMove);
        this.removeCallback = () => {
            userSession.socket.off("new-move", handleNewMove);
        };
    }
    remove() {
        if (this.removeCallback) {
            this.removeCallback();
        }
    }
    onConnected(userSession, gameSession) {
        if (gameSession.gameData.firstUserId === null) {
            this.scheduleComputerMove(gameSession);
        }
    }
    handleNewMove(userSession, gameSession, columnNumber) {
        if (this.isValidSubmission(userSession, gameSession) && gameSession.game.isValidMove(columnNumber)) {
            this.processMove(gameSession, columnNumber);
            if (!gameSession.game.isComplete) {
                this.scheduleComputerMove(gameSession);
            }
        }
    }
    processMove(gameSession, columnNumber) {
        const newMove = gameSession.game.processMove(columnNumber);
        gameSession.sendUpdateForMove(newMove);
    }
    isValidSubmission(userSession, gameSession) {
        const userId = userSession.userId;
        return gameSession.gameData.firstUserId === userId || gameSession.gameData.secondUserId === userId;
    }
    scheduleComputerMove(gameSession) {
        const delay = 500 + Math.floor(Math.random() * 1000);
        setTimeout(() => {
            const columnNumber = this.ai(gameSession.game);
            this.processMove(gameSession, columnNumber);
        }, delay);
    }
}
exports.default = ComputerGameConfig;
