import { GameState } from "../models/GameState"
import { UserSession } from "./UserSession";

import { v4 as uuid } from 'uuid'

export type GameSessionId = string

interface SerializedGameState {
    id: GameSessionId
}

interface SerializedGameEvent {
    id: GameSessionId
}

export abstract class GameSession {

    public id: GameSessionId = uuid()
    private gameState: GameState = GameState.initial()

    constructor(public playerSessions: UserSession[]) {

    }

    get currentState(): SerializedGameState{
        return {id: this.id}
    }
    
}