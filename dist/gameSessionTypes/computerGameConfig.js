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
                gameSession.processMoveRequest(columnNumber);
                if (!gameSession.game.isComplete) {
                    this.scheduleComputerMove(gameSession);
                }
            }
        };
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
    isValidSubmission(userSession, gameSession) {
        const currentPlayer = gameSession.game.currentPlayer;
        const userId = userSession.userId;
        if (currentPlayer === 1) {
            return gameSession.gameData.firstUserId === userId;
        }
        else {
            return gameSession.gameData.secondUserId === userId;
        }
    }
    scheduleComputerMove(gameSession) {
        const delay = 500 + Math.floor(Math.random() * 1000);
        setTimeout(() => {
            const columnNumber = this.ai(gameSession.game);
            gameSession.processMoveRequest(columnNumber);
        }, delay);
    }
}
exports.default = ComputerGameConfig;
