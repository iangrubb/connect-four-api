import { Socket } from 'socket.io'
import { v4 as uuid } from 'uuid'
import { SocketId } from './Socket'

export type UserSessionId = string

export class UserSession {

    public id: UserSessionId
    public sockets: Map<SocketId, Socket> = new Map()

    constructor(userId: UserSessionId | undefined) {
        this.id = userId ? userId : uuid()
    }

    addSocket(socket: Socket): void {

        

        this.sockets.set(socket.id, socket)

        // console.log("Adding socket, sockets now:")

        // const sockets: string[] = []
        // this.sockets.forEach(s => sockets.push(s.id))

        // console.log(sockets)

        
    }

    removeSocket(socket: Socket): void {
        this.sockets.delete(socket.id)
    }

    get socketCount(): number {
        return this.sockets.size
    }

    messageSockets(message: string, payload: object): void {

        // const sockets: string[] = []
        // this.sockets.forEach(s => sockets.push(s.id))

        // console.log("Messaging these sockets")

        // console.log(sockets)

        this.sockets.forEach((socket: Socket): void => {socket.emit(message, payload)})
    }
}