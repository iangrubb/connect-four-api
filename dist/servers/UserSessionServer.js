"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionServer = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const UserSession_1 = require("../sessions/UserSession");
const Socket_1 = require("../sessions/Socket");
class UserSessionServer {
    constructor(io) {
        this.io = io;
        this.userSessions = new Map();
        this.handleConnect = (socket) => {
            const { userId } = Socket_1.getQueryParams(socket);
            let session = userId ? this.userSessions.get(userId) : undefined;
            if (!session) {
                session = this.initializeUserSession();
                Socket_1.updateQueryParams(socket, { userId: session.id });
                socket.emit('assigned-user-id', session.id);
            }
            session.addSocket(socket);
            return session;
        };
        this.handleDisconnect = ({ socket, session }) => {
            session.removeSocket(socket);
            if (session.socketCount === 0) {
                this.userSessions.delete(session.id);
            }
        };
        this.userConnection$ = rxjs_1.fromEvent(this.io, "connection").pipe(operators_1.map((socket) => ({ socket, session: this.handleConnect(socket) })), operators_1.multicast(new rxjs_1.Subject()));
        this.userConnection$.connect();
        this.userMessage$("disconnect").subscribe(this.handleDisconnect);
    }
    userMessage$(message) {
        return this.userConnection$.pipe(operators_1.mergeMap(({ socket, session }) => rxjs_1.fromEvent(socket, message).pipe(operators_1.takeUntil(rxjs_1.fromEvent(socket, "disconnect")), operators_1.map((payload) => ({ message, payload, session, socket })), operators_1.endWith({ message: "disconnect", session, socket }))));
    }
    initializeUserSession() {
        const newSession = new UserSession_1.UserSession();
        this.userSessions.set(newSession.id, newSession);
        return newSession;
    }
}
exports.UserSessionServer = UserSessionServer;
