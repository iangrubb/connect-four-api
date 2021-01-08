import { Socket } from 'socket.io'
import { v4 as uuid } from 'uuid'
import { SocketId } from './Socket'

export type UserSessionId = string

export class UserSession {

    public id: UserSessionId = uuid()
    public sockets: Map<SocketId, Socket> = new Map()

    addSocket(socket: Socket): void {
        this.sockets.set(socket.id, socket)
    }

    removeSocket(socket: Socket): void {
        this.sockets.delete(socket.id)
    }

    get socketCount(): number {
        return this.sockets.size
    }

}