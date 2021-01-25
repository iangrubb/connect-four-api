import { Server, Socket } from 'socket.io'

import { Observable, ConnectableObservable, Subject, fromEvent } from 'rxjs'

import { mergeMap, map, mapTo, multicast, take, takeUntil } from 'rxjs/operators'

import { UserSession, UserSessionId } from '../sessions/UserSession'

import { getQueryParams } from '../sessions/Socket'

export interface UserMessage {
    message: string,
    payload?: any,
    session: UserSession,
    socket: Socket
}

export class UserSessionServer {

    public socketRegistration$: Subject<{socket: Socket, session: UserSession}> = new Subject()
    public sessionClose$: Subject<UserSessionId> = new Subject()

    public userSessions: Map<UserSessionId, UserSession> = new Map()

    private connection$: ConnectableObservable<{socket: Socket, session: UserSession}>
    
    constructor(private io: Server) {
        this.connection$ = fromEvent<Socket>(this.io, "connection").pipe(
            map((socket: Socket) => ({socket, session: this.handleConnect(socket)})),
            multicast(new Subject())
        ) as ConnectableObservable<{socket: Socket, session: UserSession}>

        this.connection$.connect()
        
        this.disconnect$.subscribe(this.handleDisconnect)
    }

    public get disconnect$() {
        return this.connection$.pipe(
            mergeMap(({socket, session}: {socket: Socket, session: UserSession}) => fromEvent<Socket>(socket, "disconnect").pipe(
                mapTo({message: "disconnect", session, socket}),
                take(1)
            ))
        )
    }

    public userMessage$(message: string): Observable<UserMessage> {
        return this.connection$.pipe(
            mergeMap(({socket, session}: {socket: Socket, session: UserSession}) => fromEvent<Socket>(socket, message).pipe(
                takeUntil(fromEvent(socket, "disconnect")),
                map((payload: any) => ({message, payload, session, socket}))
            ))
        )
    }

    private handleConnect = (socket: Socket): UserSession => {
        const { userId } = getQueryParams(socket)

        let session = userId ? this.userSessions.get(userId) : undefined

        if (!session) {
            session = this.initializeUserSession(userId)
        }

        session.addSocket(socket)

        this.socketRegistration$.next({ socket, session })

        return session
    }

    private initializeUserSession(userId: UserSessionId | undefined): UserSession {
        const newSession = new UserSession(userId)
        this.userSessions.set(newSession.id, newSession)
        return newSession
    }

    private handleDisconnect = ({socket, session}: {socket: Socket, session: UserSession}): void => {
        session.removeSocket(socket)

        if (session.socketCount === 0) {
            this.userSessions.delete(session.id)
            this.sessionClose$.next(session.id)
        }
    }
}