import { Socket } from 'socket.io'

export type SocketId = string

interface QueryParams {
    userId?: string
}

export const getQueryParams = (socket: Socket): QueryParams => socket.handshake.query

export const updateQueryParams = (socket: Socket, updateParams: QueryParams): void => {
    socket.handshake.query = {...socket.handshake.query, ...updateParams}
}