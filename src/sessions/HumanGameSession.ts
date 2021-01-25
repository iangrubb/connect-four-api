import { GameSession } from "./GameSession"

import { SerializedGameState } from "./GameSession"
import { UserSession, UserSessionId } from "./UserSession"

export class HumanGameSession extends GameSession {

    constructor() {
        super()
    }

    reportConcession(concedingPlayerId: UserSessionId): void {
        const opponent = this.playerSessions.find(p => p.id !== concedingPlayerId) as UserSession

        opponent.messageSockets('UPDATE game', {
            id: this.id, ongoing: false,
            winnerId: opponent.id
        })
    }

}