"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const gameSession_1 = __importDefault(require("./gameSessionTypes/gameSession"));
const gameAI_1 = __importDefault(require("./gameAI"));
class GameSessionFactory {
    static asyncInitialize(gameId) {
        const sessionSubject = new rxjs_1.BehaviorSubject(null);
        GameSessionFactory.fetchGameData(gameId)
            .then(data => {
            const actionHandlers = {
                ['new-move-request']: (session, client, action) => {
                    const columnNumber = parseInt(action.payload);
                    const clientId = parseInt(client.handshake.query.userId);
                    GameSessionFactory.handleMoveRequest(session, clientId, columnNumber);
                }
            };
            const updateHandlers = {
                initialized: (session) => {
                    GameSessionFactory.maybeScheduleComputerMove(session);
                },
                ['new-move']: (session) => {
                    GameSessionFactory.maybeScheduleComputerMove(session);
                }
            };
            const gameSession = new gameSession_1.default(data, actionHandlers, updateHandlers);
            sessionSubject.next(gameSession);
        });
        return sessionSubject;
    }
    static fetchGameData(gameId) {
        // Fake for now
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    gameId,
                    firstUserId: null,
                    secondUserId: 1,
                    movesHistory: [],
                    validUsers: [1]
                });
            }, 500);
        });
    }
    // Could be moved to other files
    static handleMoveRequest(session, clientId, columnNumber) {
        if (session.activeUser === clientId && session.game.isValidMove(columnNumber)) {
            session.processMove(columnNumber);
        }
    }
    static maybeScheduleComputerMove(session) {
        if (!session.activeUser && !session.game.isComplete) {
            const delay = 500 + Math.floor(Math.random() * 1000);
            setTimeout(() => {
                const columnNumber = gameAI_1.default.basic(session.game);
                session.processMove(columnNumber);
            }, delay);
        }
    }
}
exports.default = GameSessionFactory;
