"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
const uuid_1 = require("uuid");
class UserSession {
    constructor() {
        this.id = uuid_1.v4();
        this.sockets = new Map();
    }
    addSocket(socket) {
        this.sockets.set(socket.id, socket);
    }
    removeSocket(socketId) {
        this.sockets.delete(socketId);
    }
    get socketCount() {
        return this.sockets.size;
    }
}
exports.UserSession = UserSession;
