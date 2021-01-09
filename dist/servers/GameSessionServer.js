"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUser = null;
        this.handleCreateGame = (userMessage) => {
        };
        this.handleConnectGame = (userMessage) => {
        };
        this.handleGameAction = (userMessage) => {
        };
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleCreateGame);
        this.userSessionServer.userMessage$("CONNECT game").subscribe(this.handleConnectGame);
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleGameAction);
        this.userSessionServer.userDisconnect$.subscribe(console.log);
    }
}
exports.GameSessionServer = GameSessionServer;
