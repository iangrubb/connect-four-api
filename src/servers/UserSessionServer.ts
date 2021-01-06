import { Server, Socket } from 'socket.io'

import { Observable, of, fromEvent } from 'rxjs'

import { switchMap, mergeMap, mapTo } from 'rxjs/operators'

import { UserSession, UserSessionId, SocketId } from '../sessions/UserSession'

interface QueryParams {
    userId?: string
}

const getQueryParams = (socket: Socket): QueryParams => socket.handshake.query

const updateQueryParams = (socket: Socket, updateParams: QueryParams): void => {
    socket.handshake.query = {...socket.handshake.query, ...updateParams}
}

export class UserSessionServer {

    userSessions: Map<UserSessionId, UserSession> = new Map()
    
    constructor(private io: Server) {}

    get socketConnect$(): Observable<Socket> {
        return of(this.io).pipe(
            switchMap(io => fromEvent<Socket>(io, "connection"))
        )
    }

    get socketDisconnect$(): Observable<{sessionId: UserSessionId | undefined, socketId: SocketId}> {
        return this.socketConnect$.pipe(
            mergeMap((socket: Socket) => fromEvent<Socket>(socket, "disconnect").pipe(
                mapTo({sessionId: getQueryParams(socket).userId, socketId: socket.id})
            ))
        )
    }

    run(): void {
        this.socketConnect$.subscribe(this.handleConnect)
        this.socketDisconnect$.subscribe(this.handleDisconnect)
    }

    private handleConnect = (socket: Socket): void => {

        console.log("Connection", socket.id)

        const { userId } = getQueryParams(socket)
        let session = userId ? this.userSessions.get(userId) : null

        if (!session) {
            session = this.initializeUserSession()
            updateQueryParams(socket, {userId: session.id})
            console.log("Made Session", session.id, "Total:", this.userSessions.size)
        }
        
        session.addSocket(socket)

    }

    private initializeUserSession(): UserSession {
        const newSession = new UserSession()
        this.userSessions.set(newSession.id, newSession)
        return newSession
    }

    private handleDisconnect = ({socketId, sessionId}: {socketId: SocketId, sessionId: UserSessionId | undefined}): void => {

        console.log("Disconnect", socketId)
        
        const session = sessionId ? this.userSessions.get(sessionId) : undefined

        if (session) {
            session.removeSocket(socketId)
            if (session.socketCount === 0) {
                this.userSessions.delete(sessionId as UserSessionId)
                console.log("Killed Session", sessionId, "Total:", this.userSessions.size)
            }
        }
    }


    // If the socket arrives with a recognized id, add the client to a map from id to clients



    // Main goal: have a userMessage stream, which says what message was sent, by what client, and for which user session

}