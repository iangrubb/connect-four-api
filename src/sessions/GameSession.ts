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
    public playerSessions: UserSession[] = []

    constructor() {

    }

    get currentState(): SerializedGameState{
        return {id: this.id}
    }

    public addPlayer(playerSession: UserSession): void {
        this.playerSessions.push(playerSession)
    }
    
}