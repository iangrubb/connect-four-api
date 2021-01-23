"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
const HumanGameSession_1 = require("../sessions/HumanGameSession");
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUser = null;
        this.gameSessions = new Map();
        this.handleNewGame = (userMessage) => {
            switch (userMessage.payload.gameType) {
                case "randomHuman":
                    if (this.waitingUser && this.waitingUser.id !== userMessage.session.id) {
                        const newGame = new HumanGameSession_1.HumanGameSession([userMessage.session, this.waitingUser]);
                        this.gameSessions.set(newGame.id, newGame);
                        newGame.playerSessions.forEach((session) => session.messageSockets("CONNECTED game", newGame.currentState));
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
        this.handleSocketRegistration = ({ socket, session }) => {
        };
        this.handleUserSessionClose = (userId) => {
        };
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame);
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame);
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction);
        this.userSessionServer.socketRegistration$.subscribe(this.handleSocketRegistration);
        this.userSessionServer.sessionClose$.subscribe(this.handleUserSessionClose);
    }
}
exports.GameSessionServer = GameSessionServer;
