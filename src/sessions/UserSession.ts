

import { Socket } from 'socket.io'
import { v4 as uuid } from 'uuid'

export type UserSessionId = string

export type SocketId = string

export class UserSession {

    public id: UserSessionId = uuid()
    public sockets: Map<SocketId, Socket> = new Map()

    addSocket(socket: Socket): void {
        this.sockets.set(socket.id, socket)
    }

    removeSocket(socketId: SocketId): void {
        this.sockets.delete(socketId)
    }

    get socketCount(): number {
        return this.sockets.size
    }

}