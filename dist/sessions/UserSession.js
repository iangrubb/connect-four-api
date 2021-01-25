"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
const uuid_1 = require("uuid");
class UserSession {
    constructor(userId) {
        this.sockets = new Map();
        this.id = userId ? userId : uuid_1.v4();
    }
    addSocket(socket) {
        this.sockets.set(socket.id, socket);
    }
    removeSocket(socket) {
        this.sockets.delete(socket.id);
    }
    get socketCount() {
        return this.sockets.size;
    }
    messageSockets(message, payload) {
        this.sockets.forEach((socket) => { socket.emit(message, payload); });
    }
}
exports.UserSession = UserSession;
