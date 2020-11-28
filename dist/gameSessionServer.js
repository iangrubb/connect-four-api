"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const gameAI_1 = __importDefault(require("./gameAI"));
const operators_1 = require("rxjs/operators");
const gameLogic_1 = __importDefault(require("./gameLogic"));
class GameSessionServer {
    constructor(userSessionServer) {
        this.gameSessions = new Map();
        this.userSessionServer = userSessionServer;
        this.gameJoin$.subscribe(({ client, session }) => {
            client.emit('initial-game-state', GameSessionServer.serializeFullGameState(session));
        });
        this.gameActionStream("new-move-request").subscribe(({ client, session, data }) => {
            const columnNumber = parseInt(data);
            const currentPlayer = session.game.currentPlayer;
            const userId = parseInt(client.handshake.query.userId);
            let validSubmission;
            if (currentPlayer === 1) {
                validSubmission = session.firstUserId === userId;
            }
            else {
                validSubmission = session.secondUserId === userId;
            }
            if (validSubmission && session.game.isValidMove(columnNumber)) {
                const newMove = session.game.newMove(columnNumber);
                client.emit("new-move-alert", GameSessionServer.serializeMove(session, newMove));
                if (!session.game.isComplete) {
                    const delay = 500 + Math.floor(Math.random() * 1000);
                    setTimeout(() => {
                        const column = gameAI_1.default.basic(session.game);
                        const compMove = session.game.newMove(column);
                        client.emit('new-move-alert', GameSessionServer.serializeMove(session, compMove));
                    }, delay);
                }
            }
        });
    }
    get gameJoinRequest$() {
        return this.userSessionServer.streamClientEvent("join-game");
    }
    get gameJoin$() {
        return this.gameJoinRequest$.pipe(operators_1.mergeMap(({ io, client, data }) => this.findOrCreateGameSession(parseInt(data)).pipe(operators_1.filter(maybeSession => maybeSession !== null), operators_1.filter(session => this.validateUser(session, parseInt(client.handshake.query.userId))), operators_1.map(session => ({ io, client, session })))));
    }
    gameActionStream(event) {
        return this.gameJoin$.pipe(operators_1.mergeMap(({ io, client, session }) => rxjs_1.fromEvent(client, event).pipe(operators_1.map(data => ({ io, client, session, data })), operators_1.takeUntil(rxjs_1.fromEvent(client, 'leave-game')))));
    }
    get gameDeparture$() {
        // maybe also listen to a game-emitted event "boot" for when the game is over
        return this.gameActionStream("disconnect").pipe(rxjs_1.merge(this.gameActionStream("leave-game")));
    }
    findOrCreateGameSession(gameId) {
        let gameSession = this.gameSessions.get(gameId);
        if (!gameSession) {
            gameSession = this.createGameSession(gameId);
        }
        return gameSession;
    }
    createGameSession(gameId) {
        const sessionSubject = new rxjs_1.BehaviorSubject(null);
        this.gameSessions.set(gameId, sessionSubject);
        const mockSession = {
            gameId,
            firstUserId: 1,
            secondUserId: null,
            game: new gameLogic_1.default()
        };
        setTimeout(() => {
            sessionSubject.next(mockSession);
        }, 100);
        return sessionSubject;
    }
    validateUser(session, userId) {
        return session.firstUserId === userId || session.secondUserId === userId;
    }
    static serializeFullGameState(session) {
        return {
            movesHistory: session.game.movesHistory,
            validMoves: session.game.validMoves,
            currentPlayer: session.game.currentPlayer,
            gameStatus: session.game.gameStatus
        };
    }
    static serializeMove(session, newMove) {
        return {
            newMove,
            validMoves: session.game.validMoves,
            currentPlayer: session.game.currentPlayer,
            gameStatus: session.game.gameStatus
        };
    }
}
exports.default = GameSessionServer;
