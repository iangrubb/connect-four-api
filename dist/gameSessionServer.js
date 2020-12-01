"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const gameSessionFactory_1 = __importDefault(require("./gameSessionFactory"));
class GameSessionServer {
    constructor(userSessionServer) {
        this.gameSessionObservables = new Map();
        this.userSessionServer = userSessionServer;
        this.gameJoin$.subscribe(({ client, session }) => {
            client.emit('initial-game-state', session.serializedGameState);
        });
        this.gameMemberMessage('game-action').subscribe(({ client, session, data }) => {
            if (session.gameData.gameId === data.gameId) {
                session.handleAction(client, data);
            }
        });
        this.gameMessage$.subscribe(({ client, session, update }) => {
            if (update.message === "new-move") {
                client.emit("new-move-alert", session.serializeMove(update.payload));
            }
        });
        // Add subscription here that pushes game event updates back to clients
        // Make sure they get the game state and then every update after that initial game state
    }
    get gameJoinRequest$() {
        return this.userSessionServer.clientEventObservable("join-game");
    }
    get gameJoin$() {
        return this.gameJoinRequest$.pipe(operators_1.mergeMap(({ io, client, data }) => this.fetchOrInitializeGameSession(data).pipe(operators_1.filter(maybeSession => maybeSession !== null), operators_1.filter(session => session.validateUser(parseInt(client.handshake.query.userId))), operators_1.map(session => ({ io, client, session })))));
    }
    get gameMessage$() {
        return this.gameJoin$.pipe(operators_1.mergeMap(({ io, client, session }) => session.gameUpdate$.pipe(operators_1.map(update => ({ io, client, session, update })))));
    }
    gameMemberMessage(event) {
        // Use a more general, but non-circular condition for ending the stream
        return this.gameJoin$.pipe(operators_1.mergeMap(({ io, client, session }) => rxjs_1.fromEvent(client, event).pipe(operators_1.takeUntil(rxjs_1.fromEvent(client, "leave-game")), operators_1.map(data => ({ io, client, session, data })))));
    }
    get gameDeparture$() {
        return this.gameMemberMessage("disconnect").pipe(rxjs_1.merge(this.gameMemberMessage("leave-game")));
    }
    fetchOrInitializeGameSession(gameId) {
        let gameSessionObservable = this.gameSessionObservables.get(gameId);
        if (!gameSessionObservable) {
            gameSessionObservable = gameSessionFactory_1.default.asyncInitialize(gameId);
            this.gameSessionObservables.set(gameId, gameSessionObservable);
        }
        return gameSessionObservable;
    }
}
exports.default = GameSessionServer;
