import { BehaviorSubject, fromEvent, merge } from 'rxjs';

import { map, mergeMap, filter, takeUntil } from 'rxjs/operators'

import UserSessionServer from './userSessionServer'

import GameSession from './gameSessionTypes/gameSession'

import GameSessionFactory from './gameSessionFactory'


class GameSessionServer {

    userSessionServer: UserSessionServer
    gameSessionObservables: Map<number, BehaviorSubject< null | GameSession >>
    

    constructor(userSessionServer: UserSessionServer) {

        this.gameSessionObservables = new Map()
        this.userSessionServer = userSessionServer

        this.gameJoin$.subscribe(({ client, session }) => {
            client.emit('initial-game-state', session.serializedGameState)
        })

        this.gameMemberMessage('game-action').subscribe(({ client, session, data }) => {
            if (session.gameData.gameId === data.gameId) {
                session.handleAction(client, data)
            }
        })

        this.gameMessage$.subscribe(({client, session, update}) => {
            if (update.message === "new-move") {
                client.emit("new-move-alert", session.serializeMove(update.payload))
            }
        })
    }

    get gameJoinRequest$() {
        return this.userSessionServer.clientEventObservable("join-game")
    }

    get gameJoin$() {
        return this.gameJoinRequest$.pipe(
            mergeMap(({io, client, data}) => this.fetchOrInitializeGameSession(data).pipe(
                filter(maybeSession => maybeSession !== null),
                filter(session => (session as GameSession).validateUser(parseInt(client.handshake.query.userId))),
                map(session => ({io, client, session}))
            ))
        )
    }

    get gameMessage$() {
        return this.gameJoin$.pipe(
            mergeMap(({io, client, session}) => session.gameUpdate$.pipe(
                map(update => ({io, client, session, update}))
            ))
        )
    }

    gameMemberMessage(event: string) {

        // Use a more general, but non-circular condition for ending the stream

        return this.gameJoin$.pipe(
            mergeMap(({io, client, session}) => fromEvent(client, event).pipe(
                takeUntil(fromEvent(client, "leave-game")),
                map(data => ({io, client, session, data}))
            ))
        )
    }
            
    get gameDeparture$() {
        return this.gameMemberMessage("disconnect").pipe(
            merge(this.gameMemberMessage("leave-game"))
        )
    }

    fetchOrInitializeGameSession(gameId: number) {

        let gameSessionObservable = this.gameSessionObservables.get(gameId)

        if (!gameSessionObservable) {
            gameSessionObservable = GameSessionFactory.asyncInitialize(gameId)
            this.gameSessionObservables.set(gameId, gameSessionObservable)
        }

        return gameSessionObservable
    }
}

export default GameSessionServer