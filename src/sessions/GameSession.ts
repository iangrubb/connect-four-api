import { GameState } from "../models/GameState"
import { UserSession, SerializedUserState, UserSessionId } from "./UserSession";

import { v4 as uuid } from 'uuid'

export type GameSessionId = string

export interface SerializedGameState {
    id: GameSessionId,
    players?: SerializedUserState[],
    ongoing?: boolean,
    winnerId?: UserSessionId
}

export abstract class GameSession {

    public id: GameSessionId = uuid()
    private gameState: GameState = GameState.initial()
    public playerSessions: UserSession[] = []

    constructor() {

    }

    get currentState(): SerializedGameState{
        return {id: this.id, players: this.playerSessions.map(p => p.details), ongoing: true}
    }

    public addPlayer(playerSession: UserSession): void {
        this.playerSessions.push(playerSession)
    }
    
}