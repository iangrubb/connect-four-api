"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class UserSessionServer {
    constructor(io) {
        this.io = io;
        this.connection$ = rxjs_1.fromEvent(io, "connection").pipe(operators_1.map(client => ({ io, client })));
        this.disconnect$ = this.connection$.pipe(operators_1.mergeMap(({ client }) => rxjs_1.fromEvent(client, "disconnect").pipe(operators_1.map(() => client))));
        this.connection$.subscribe((conn) => console.log(conn.client.id));
        this.disconnect$.subscribe((client) => console.log(client.id));
    }
}
exports.default = UserSessionServer;
