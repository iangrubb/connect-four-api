"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// import UserSessionManager from './userSessionManager'
// import GameSessionManager from './gameSessionManager'
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const simulateValidation = (id) => new Promise(resolve => {
    console.log("Begin Validating:", id);
    const idNumber = parseInt(id);
    setTimeout(() => resolve(idNumber === 1));
});
const connection$ = rxjs_1.fromEvent(io, "connection").pipe(operators_1.map((client) => ({ io, client })));
const validConnection$ = connection$.pipe(operators_1.mergeMap((conn) => rxjs_1.from(simulateValidation(conn.client.handshake.query.userId)).pipe(operators_1.filter(result => result), operators_1.mapTo(conn))));
const validConnectionSource$ = validConnection$.pipe(operators_1.multicast(() => new rxjs_1.Subject()));
const disconnect$ = connection$.pipe(operators_1.mergeMap(({ client }) => rxjs_1.fromEvent(client, "disconnect").pipe(operators_1.map(() => client))));
validConnectionSource$.connect();
validConnectionSource$.subscribe(conn => console.log(conn.client.id));
validConnectionSource$.subscribe(conn => console.log(conn.client.id));
// connection$.subscribe( (conn: any) => console.log(conn.client.id))
// disconnect$.subscribe( (client: any) => console.log(client.id))
// const gameSessionManager = new GameSessionManager(io)
// const userSessionManager = new UserSessionManager(gameSessionManager)
// io.on("connection", (socket: any) => {
//     userSessionManager.initializeSocket(socket)
// })
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
