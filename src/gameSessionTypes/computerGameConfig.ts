import GameSession from './gameSession'
import UserSession from '../userSession'
import GameLogic from '../gameLogic'

type AI = (game: GameLogic) => number

class ComputerGameConfig {

    ai: AI
    removeCallback: any

    constructor(ai: AI) {
        this.ai = ai
        this.removeCallback = null
    }

    public apply(userSession: UserSession, gameSession: GameSession) {

        const handleNewMove = (columnNumber: number) => {
            if (this.isValidSubmission(userSession, gameSession) && gameSession.game.isValidMove(columnNumber)) {

                this.processMove(gameSession, columnNumber)
    
                if (!gameSession.game.isComplete) {
                    this.scheduleComputerMove(gameSession)
                }
            }
        }

        // Give up message can be added later

        userSession.socket.on("new-move", handleNewMove)

        this.removeCallback = () => {
            userSession.socket.off("new-move", handleNewMove)
        }
    }


    public remove() {
        if (this.removeCallback) {
            this.removeCallback()
        }
    }

    public onConnected(userSession: UserSession, gameSession: GameSession) {
        if (gameSession.gameData.firstUserId === null) {
            this.scheduleComputerMove(gameSession)
        }
    }

    private handleNewMove(userSession: UserSession, gameSession: GameSession, columnNumber: number) {
        if (this.isValidSubmission(userSession, gameSession) && gameSession.game.isValidMove(columnNumber)) {

            this.processMove(gameSession, columnNumber)

            if (!gameSession.game.isComplete) {
                this.scheduleComputerMove(gameSession)
            }
        }
    }

    private processMove(gameSession: GameSession, columnNumber: number) {
        const newMove = gameSession.game.processMove(columnNumber)
        gameSession.sendUpdateForMove(newMove)
    }

    private isValidSubmission(userSession: UserSession, gameSession: GameSession) {
        const userId = userSession.userId
        return gameSession.gameData.firstUserId === userId || gameSession.gameData.secondUserId === userId
    }

    private scheduleComputerMove(gameSession: GameSession) {
        const delay = 500 + Math.floor(Math.random() * 1000)

        setTimeout(() => {
            const columnNumber = this.ai(gameSession.game)
            this.processMove(gameSession, columnNumber)
        }, delay)
    }
}

export default ComputerGameConfig