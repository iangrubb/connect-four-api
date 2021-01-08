import { Server, Socket } from 'socket.io'

import { Observable, ConnectableObservable, Subject, fromEvent } from 'rxjs'

import { mergeMap, map, multicast, takeUntil, endWith } from 'rxjs/operators'

import { UserSession, UserSessionId } from '../sessions/UserSession'

import { getQueryParams, updateQueryParams } from '../sessions/Socket'

interface UserMessage {
    message: string,
    payload?: any,
    session: UserSession,
    socket: Socket
}

export class UserSessionServer {

    userSessions: Map<UserSessionId, UserSession> = new Map()
    userConnection$: ConnectableObservable<{socket: Socket, session: UserSession}>
    
    constructor(private io: Server) {

        this.userConnection$ = fromEvent<Socket>(this.io, "connection").pipe(
            map((socket: Socket) => ({socket, session: this.handleConnect(socket)})),
            multicast(new Subject())
        ) as ConnectableObservable<{socket: Socket, session: UserSession}>

        this.userConnection$.connect()
        
        this.userMessage$("disconnect").subscribe(this.handleDisconnect)
    }

    userMessage$(message: string): Observable<UserMessage> {
        return this.userConnection$.pipe(
            mergeMap(({socket, session}: {socket: Socket, session: UserSession}) => fromEvent<Socket>(socket, message).pipe(
                takeUntil(fromEvent(socket, "disconnect")),
                map((payload: any) => ({message, payload, session, socket})),
                endWith({message: "disconnect", session, socket})
            ))
        )
    }

    private handleConnect = (socket: Socket): UserSession => {

        const { userId } = getQueryParams(socket)
        let session = userId ? this.userSessions.get(userId) : undefined

        if (!session) {
            session = this.initializeUserSession()
            updateQueryParams(socket, {userId: session.id})
            socket.emit('assigned-user-id', session.id)
        }

        session.addSocket(socket)
        
        return session
    }

    private initializeUserSession(): UserSession {
        const newSession = new UserSession()
        this.userSessions.set(newSession.id, newSession)
        return newSession
    }

    private handleDisconnect = ({socket, session}: {socket: Socket, session: UserSession}): void => {
        
        session.removeSocket(socket)

        if (session.socketCount === 0) {
            this.userSessions.delete(session.id)
        }
    }
}