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
        // console.log("Adding socket, sockets now:")
        // const sockets: string[] = []
        // this.sockets.forEach(s => sockets.push(s.id))
        // console.log(sockets)
    }
    removeSocket(socket) {
        this.sockets.delete(socket.id);
    }
    get socketCount() {
        return this.sockets.size;
    }
    messageSockets(message, payload) {
        // const sockets: string[] = []
        // this.sockets.forEach(s => sockets.push(s.id))
        // console.log("Messaging these sockets")
        // console.log(sockets)
        this.sockets.forEach((socket) => { socket.emit(message, payload); });
    }
}
exports.UserSession = UserSession;
