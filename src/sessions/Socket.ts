import { Socket } from 'socket.io'

export type SocketId = string

interface QueryParams {
    userId?: string
}

export const getQueryParams = (socket: Socket): QueryParams => socket.handshake.query
