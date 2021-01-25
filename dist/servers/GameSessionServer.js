"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSessionServer = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const HumanGameSession_1 = require("../sessions/HumanGameSession");
class GameSessionServer {
    constructor(userSessionServer) {
        this.userSessionServer = userSessionServer;
        this.waitingUserId = null;
        this.waitingSockets = [];
        this.gameSessions = new Map();
        this.sessionsOfUsers = new Map();
        this.userTimeoutPeriod = 1000;
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
                        this.waitingSockets = [];
                    }
                    else {
                        this.waitingUserId = userMessage.session.id;
                        this.waitingSockets.push(userMessage.socket);
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
                        this.waitingSockets = this.waitingSockets.filter(s => s !== userMessage.socket);
                        if (this.waitingSockets.length === 0) {
                            this.waitingUserId = null;
                        }
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
        this.handleSocketDisconnect = (userMessage) => {
            if (this.waitingUserId && this.waitingUserId === userMessage.session.id) {
                this.waitingSockets = this.waitingSockets.filter(s => s !== userMessage.socket);
                if (this.waitingSockets.length === 0) {
                    this.waitingUserId = null;
                }
            }
        };
        this.handleSocketRegistration = ({ socket, session }) => {
            const gameSessions = this.sessionsOfUsers.get(session.id);
            socket.emit('CONNECTED user', {
                id: session.id,
                activeGames: (gameSessions === null || gameSessions === void 0 ? void 0 : gameSessions.map(s => s.currentState)) || [],
                waitingForGame: this.waitingUserId && this.waitingUserId === session.id
            });
        };
        this.handleUserSessionClose = (userId) => {
        };
        this.handleUserTimeout = (userId) => {
            // close all of that user's games
            // for any multiplayer games, a timeout message should be sent
        };
        this.userSessionServer.userMessage$("POST game").subscribe(this.handleNewGame);
        this.userSessionServer.userMessage$("DELETE game").subscribe(this.handleDeleteGame);
        this.userSessionServer.userMessage$("POST game/action").subscribe(this.handleNewGameAction);
        this.userSessionServer.socketRegistration$.subscribe(this.handleSocketRegistration);
        this.userSessionServer.disconnect$.subscribe(this.handleSocketDisconnect);
        this.userSessionServer.sessionClose$.subscribe(this.handleUserSessionClose);
        this.userSessionTimeout$.subscribe(this.handleUserTimeout);
    }
    get userSessionTimeout$() {
        return this.userSessionServer.sessionClose$.pipe(operators_1.mergeMap((userSessionId) => rxjs_1.timer(this.userTimeoutPeriod).pipe(operators_1.mapTo(userSessionId), operators_1.takeUntil(this.userSessionServer.socketRegistration$.pipe(operators_1.filter(({ session }) => session.id === userSessionId))))));
    }
}
exports.GameSessionServer = GameSessionServer;
