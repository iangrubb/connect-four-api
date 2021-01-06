"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionServer = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const UserSession_1 = require("../sessions/UserSession");
const getQueryParams = (socket) => socket.handshake.query;
const updateQueryParams = (socket, updateParams) => {
    socket.handshake.query = Object.assign(Object.assign({}, socket.handshake.query), updateParams);
};
class UserSessionServer {
    constructor(io) {
        this.io = io;
        this.userSessions = new Map();
        this.handleConnect = (socket) => {
            console.log("Connection", socket.id);
            const { userId } = getQueryParams(socket);
            let session = userId ? this.userSessions.get(userId) : null;
            if (!session) {
                session = this.initializeUserSession();
                updateQueryParams(socket, { userId: session.id });
                console.log("Made Session", session.id, "Total:", this.userSessions.size);
            }
            session.addSocket(socket);
        };
        this.handleDisconnect = ({ socketId, sessionId }) => {
            console.log("Disconnect", socketId);
            const session = sessionId ? this.userSessions.get(sessionId) : undefined;
            if (session) {
                session.removeSocket(socketId);
                if (session.socketCount === 0) {
                    this.userSessions.delete(sessionId);
                    console.log("Killed Session", sessionId, "Total:", this.userSessions.size);
                }
            }
        };
    }
    get socketConnect$() {
        return rxjs_1.of(this.io).pipe(operators_1.switchMap(io => rxjs_1.fromEvent(io, "connection")));
    }
    get socketDisconnect$() {
        return this.socketConnect$.pipe(operators_1.mergeMap((socket) => rxjs_1.fromEvent(socket, "disconnect").pipe(operators_1.mapTo({ sessionId: getQueryParams(socket).userId, socketId: socket.id }))));
    }
    run() {
        this.socketConnect$.subscribe(this.handleConnect);
        this.socketDisconnect$.subscribe(this.handleDisconnect);
    }
    initializeUserSession() {
        const newSession = new UserSession_1.UserSession();
        this.userSessions.set(newSession.id, newSession);
        return newSession;
    }
}
exports.UserSessionServer = UserSessionServer;
