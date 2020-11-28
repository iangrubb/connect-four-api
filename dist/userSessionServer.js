"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class UserSessionServer {
    constructor(io) {
        this.io$ = rxjs_1.of(io);
        this.connection$ =
            this.io$.pipe(operators_1.switchMap(io => rxjs_1.fromEvent(io, "connection").pipe(operators_1.map((client) => ({ io, client })))));
        this.disconnect$ =
            this.connection$.pipe(operators_1.mergeMap(({ client }) => rxjs_1.fromEvent(client, "disconnect").pipe(operators_1.mapTo(client))));
        this.validConnection$ =
            this.connection$.pipe(operators_1.mergeMap((conn) => rxjs_1.from(UserSessionServer.validateSession(conn.client.handshake.query.userId)).pipe(operators_1.filter(result => result), operators_1.mapTo(conn))), operators_1.multicast(new rxjs_1.Subject()));
        // Creating Subscriptions
        this.connection$.subscribe((conn) => console.log("Connection:", conn.client.id));
        this.disconnect$.subscribe((client) => console.log("Disconnect:", client.id));
        this.validConnection$.subscribe(({ client }) => {
            console.log("Admitting valid:", client.id);
            client.emit("admit");
        });
        this.validConnection$.connect();
    }
    streamClientEvent(event) {
        return this.validConnection$.pipe(operators_1.mergeMap(({ io, client }) => rxjs_1.fromEvent(client, event).pipe(operators_1.takeUntil(rxjs_1.fromEvent(client, "disconnect")), operators_1.map(data => ({ io, client, data })))));
    }
    static validateSession(id) {
        return new Promise(resolve => {
            // Perform real validation later
            console.log("Validating:", id);
            const idNumber = parseInt(id);
            setTimeout(() => resolve(idNumber === 1), 200);
        });
    }
}
exports.default = UserSessionServer;
