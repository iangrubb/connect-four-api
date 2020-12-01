"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ComputerGameConfig {
    constructor(ai) {
        this.ai = ai;
        this.session = null;
    }
    injectSession(session) {
        this.session = session;
    }
    onCreate() {
        if (this.session.gameData.firstUserId === null) {
            this.scheduleComputerMove();
        }
    }
    handleAction(client, action) {
        switch (action.message) {
            case "new-move-request":
                const columnNumber = parseInt(action.payload);
                const clientId = parseInt(client.handshake.query.userId);
                this.handleMoveRequest(clientId, columnNumber);
                break;
            default:
                break;
        }
    }
    handleMoveRequest(clientId, columnNumber) {
        if (this.session.activeUser === clientId && this.session.game.isValidMove(columnNumber)) {
            this.processMove(columnNumber);
            if (!this.session.game.isComplete) {
                this.scheduleComputerMove();
            }
        }
    }
    processMove(columnNumber) {
        // Instead of emitting an event directly to the users, it might be cleaner here to emit an event that's
        // listened to by the gameSessionServer that it uses to send feedback to connected users.
        const newMove = this.session.game.newMove(columnNumber);
        // Old:
        // client.emit("new-move-alert", gameSession.serializeMove(newMove))
    }
}
exports.default = ComputerGameConfig;
