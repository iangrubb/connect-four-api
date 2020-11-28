
import { BehaviorSubject, fromEvent, merge } from 'rxjs';

import GameAI from './gameAI'

import { map, mergeMap, filter, mapTo, multicast, switchMap, take, takeUntil, refCount, startWith, mergeAll, tap } from 'rxjs/operators'

import UserSessionServer from './userSessionServer'
import GameLogic from './gameLogic'

class GameSessionServer {

    userSessionServer: UserSessionServer
    gameSessions: Map<number, any>

    gameJoinRequest$: any
    gameJoin$: any

    constructor(userSessionServer: UserSessionServer) {

        this.gameSessions = new Map()
        this.userSessionServer = userSessionServer
        
        this.gameJoin$.subscribe(({client, session}) => {
            client.emit('initial-game-state', GameSessionServer.serializeFullGameState(session))
        })

        this.gameActionStream("new-move-request").subscribe(({client, session, data}) => {

            const columnNumber = parseInt(data)
            
            const currentPlayer = session.game.currentPlayer
            const userId = parseInt(client.handshake.query.userId)

            let validSubmission

            if (currentPlayer === 1) {
                validSubmission = session.firstUserId === userId
            } else {
                validSubmission = session.secondUserId === userId
            }
            
            if (validSubmission && session.game.isValidMove(columnNumber)) {

                const newMove = session.game.newMove(columnNumber)

                client.emit("new-move-alert", GameSessionServer.serializeMove(session, newMove))
                
                if (!session.game.isComplete) {

                    const delay = 500 + Math.floor(Math.random() * 1000)

                    setTimeout(() => {

                        const column = GameAI.basic(session.game)

                        const compMove = session.game.newMove(column)

                        client.emit('new-move-alert', GameSessionServer.serializeMove(session, compMove))

                    }, delay)
                }
            }
        })
    }

    get gameJoinRequest$() {
        return this.userSessionServer.streamClientEvent("join-game")
    }

    get gameJoin$() {
        return this.gameJoinRequest$.pipe(
            mergeMap(({io, client, data}) => this.findOrCreateGameSession(parseInt(data)).pipe(
                filter(maybeSession => maybeSession !== null),
                filter(session => this.validateUser(session, parseInt(client.handshake.query.userId))),
                map(session => ({io, client, session}))
            ))
        )
    }
            
    gameActionStream(event: string) {
        return this.gameJoin$.pipe(
            mergeMap(({io, client, session}) => fromEvent(client, event).pipe(
                map(data => ({io, client, session, data})),
                takeUntil(fromEvent(client, 'leave-game'))
            ))
        )
    }

    get gameDeparture$() {

        // maybe also listen to a game-emitted event "boot" for when the game is over

        return this.gameActionStream("disconnect").pipe(
            merge(this.gameActionStream("leave-game"))
        )
    }

    findOrCreateGameSession(gameId: number) {

        let gameSession = this.gameSessions.get(gameId)

        if (!gameSession) {
            gameSession = this.createGameSession(gameId)
        }

        return gameSession
    }

    createGameSession(gameId: number) {

        const sessionSubject = new BehaviorSubject<null | object>(null)

        this.gameSessions.set(gameId, sessionSubject)

        const mockSession = {
            gameId,
            firstUserId: 1,
            secondUserId: null,
            game: new GameLogic()
        }

        setTimeout(() => {            
            sessionSubject.next(mockSession)
        }, 100)

        return sessionSubject
    }

    validateUser(session, userId: number) {
        return session.firstUserId === userId || session.secondUserId === userId
    }

    static serializeFullGameState(session) {
        return {
            movesHistory: session.game.movesHistory,
            validMoves: session.game.validMoves,
            currentPlayer: session.game.currentPlayer,
            gameStatus: session.game.gameStatus
        }
    }

    static serializeMove(session, newMove) {
        return {
            newMove,
            validMoves: session.game.validMoves,
            currentPlayer: session.game.currentPlayer,
            gameStatus: session.game.gameStatus
        }
    }
}

export default GameSessionServer