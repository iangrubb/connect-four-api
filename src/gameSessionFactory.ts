import { BehaviorSubject } from 'rxjs'

import GameSession from "./gameSessionTypes/gameSession";

import GameAI from './gameAI'

class GameSessionFactory {

    public static asyncInitialize(gameId: number) {

        const sessionSubject = new BehaviorSubject<null | object>(null)

        GameSessionFactory.fetchGameData(gameId)
        .then(data => {

            const actionHandlers = {
                ['new-move-request']: (session: GameSession, client, action) => {

                    const columnNumber = parseInt(action.payload)
                    const clientId = parseInt(client.handshake.query.userId)

                    GameSessionFactory.handleMoveRequest(session, clientId, columnNumber)
                }
            }

            const updateHandlers = {
                initialized: (session: GameSession) => {
                    GameSessionFactory.maybeScheduleComputerMove(session)
                },
                ['new-move']: (session: GameSession) => {
                    GameSessionFactory.maybeScheduleComputerMove(session)
                }
            }

            const gameSession = new GameSession(data, actionHandlers, updateHandlers)

            sessionSubject.next(gameSession)
        })

        return sessionSubject
    }

    private static fetchGameData(gameId: number) {
        
        // Fake for now

        return new Promise(resolve => {
            setTimeout(()=>{
                resolve({
                    gameId,
                    firstUserId: null,
                    secondUserId: 1,
                    movesHistory: [],
                    validUsers: [1]
                })
            }, 500)
        })
    }


    // Could be moved to other files

    private static handleMoveRequest(session: GameSession, clientId: number, columnNumber: number) {

        if (session.activeUser === clientId && session.game.isValidMove(columnNumber)) {
            session.processMove(columnNumber)
        }
    }

    private static maybeScheduleComputerMove(session: GameSession) {

        if (!session.activeUser && !session.game.isComplete) {
            const delay = 500 + Math.floor(Math.random() * 1000)

            setTimeout(() => {
                const columnNumber = GameAI.basic(session.game)
                session.processMove(columnNumber)
            }, delay)
        }   
    }
}

export default GameSessionFactory