"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUser = null;
        this.handleNewGame = (userMessage) => {
            switch (userMessage.payload.gameType) {
                case "randomHuman":
                    if (this.waitingUser) {
                        // make and register a new game session of the appropriate type
                        // message users letting them know a new game has started
                        this.waitingUser = null;
                    }
                    else {
                        this.waitingUser = userMessage.session;
                    }
                    break;
                case "linkedHuman":
                    break;
                case "computer":
                    break;
                default:
                    break;
            }
        };
        this.handleDeleteGame = (userMessage) => {
            switch (userMessage.payload.gameType) {
                case "randomHuman":
                    if (this.waitingUser && this.waitingUser.id === userMessage.session.id) {
                        this.waitingUser = null;
                    }
                    break;
                case "computer":
                    break;
                default:
                    break;
            }
        };
        this.handleNewGameAction = (userMessage) => {
        };
        this.handleSocketConnect = ({ socket, session }) => {
        };
        this.handleUserDisconnect = (userId) => {
        };
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame);
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame);
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction);
        this.userSessionServer.processedSocketConnect$.subscribe(this.handleSocketConnect);
        this.userSessionServer.processedSessionDisconnect$.subscribe(this.handleUserDisconnect);
    }
}
exports.GameSessionServer = GameSessionServer;
