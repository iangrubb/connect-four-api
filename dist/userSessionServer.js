"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class UserSessionServer {
    constructor(io) {
        this.io$ = rxjs_1.of(io);
        this.validConnection$ =
            this.connection$.pipe(operators_1.mergeMap((conn) => rxjs_1.from(UserSessionServer.validateConnection(conn)).pipe(operators_1.filter(result => result), operators_1.mapTo(conn))), operators_1.multicast(new rxjs_1.Subject()));
        this.validConnection$.connect();
        this.validConnection$.subscribe(({ client }) => {
            client.emit("admit");
        });
    }
    get connection$() {
        return this.io$.pipe(operators_1.switchMap(io => rxjs_1.fromEvent(io, "connection").pipe(operators_1.map((client) => ({ io, client })))));
    }
    clientEventObservable(event) {
        return this.validConnection$.pipe(operators_1.mergeMap(({ io, client }) => rxjs_1.fromEvent(client, event).pipe(operators_1.takeUntil(rxjs_1.fromEvent(client, "disconnect")), operators_1.map(data => ({ io, client, data })))));
    }
    static validateConnection(conn) {
        return new Promise(resolve => {
            // Perform real validation later
            const idNumber = parseInt(conn.client.handshake.query.userId);
            setTimeout(() => resolve(idNumber === 1), 200);
        });
    }
}
exports.default = UserSessionServer;
