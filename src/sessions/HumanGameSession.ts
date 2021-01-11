import { UserSession } from "./UserSession";

import { GameState } from "../models/GameState"

import { v4 as uuid } from 'uuid'

export type GameSessionId = string

interface SerializedGameState {
    id: GameSessionId
}

export class HumanGameSession {

    public id: GameSessionId = uuid()
    private gameState: GameState = GameState.initial()

    constructor(public playerSessions: UserSession[]) {

    }

    get currentState(): SerializedGameState{
        return {id: this.id}
    }


    // Should be able to report on the current game state and on a recent move / concession / timeout

}