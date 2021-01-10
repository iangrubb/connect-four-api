"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUser = null;
        this.handleNewGame = (userMessage) => {
        };
        this.handleNewGameAction = (userMessage) => {
        };
        this.handleSocketConnect = ({ socket, session }) => {
        };
        this.handleUserDisconnect = (userId) => {
        };
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame);
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction);
        this.userSessionServer.processedSocketConnect$.subscribe(this.handleSocketConnect);
        this.userSessionServer.processedSessionDisconnect$.subscribe(this.handleUserDisconnect);
    }
}
exports.GameSessionServer = GameSessionServer;
