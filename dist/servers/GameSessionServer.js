"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
const HumanGameSession_1 = require("../sessions/HumanGameSession");
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUserId = null;
        this.gameSessions = new Map();
        this.sessionsOfUsers = new Map();
        this.addUserToGame = (user, game) => {
            game.addPlayer(user);
            const currentGameSessions = this.sessionsOfUsers.get(user.id);
            if (currentGameSessions) {
                currentGameSessions.push(game);
            }
            else {
                this.sessionsOfUsers.set(user.id, [game]);
            }
        };
        this.removeUserFromGame = () => {
        };
        this.handleNewGame = (userMessage) => {
            switch (userMessage.payload.gameType) {
                case "randomHuman":
                    const waitingUser = this.waitingUserId ? this.userSessionServer.userSessions.get(this.waitingUserId) : undefined;
                    if (waitingUser && waitingUser.id !== userMessage.session.id) {
                        const newGame = new HumanGameSession_1.HumanGameSession();
                        this.gameSessions.set(newGame.id, newGame);
                        this.addUserToGame(userMessage.session, newGame);
                        this.addUserToGame(waitingUser, newGame);
                        newGame.playerSessions.forEach(function (session) {
                            session.messageSockets("CONNECTED game", newGame.currentState);
                        });
                        this.waitingUserId = null;
                    }
                    else {
                        this.waitingUserId = userMessage.session.id;
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
                    if (this.waitingUserId && this.waitingUserId === userMessage.session.id) {
                        this.waitingUserId = null;
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
            const gameSessions = this.sessionsOfUsers.get(session.id);
            socket.emit('CONNECTED user', {
                id: session.id,
                gameSessionIds: (gameSessions === null || gameSessions === void 0 ? void 0 : gameSessions.map(s => s.id)) || [],
                waitingForGame: this.waitingUserId && this.waitingUserId === session.id
            });
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
