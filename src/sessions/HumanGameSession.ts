import { GameSession } from "./GameSession"
import { UserSession } from "./UserSession";

export class HumanGameSession extends GameSession {

    constructor(playerSessions: UserSession[]) {
        super(playerSessions)
    }

}