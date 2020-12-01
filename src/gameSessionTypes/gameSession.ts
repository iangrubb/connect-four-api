import { Subject } from "rxjs";
import GameLogic from "../gameLogic";

export interface GameData {
    id: number,
    moveHistory: number[],
    firstUserId: number | null,
    secondUserId: number | null,
    validUsers: number[]
}

class GameSession {

    game: GameLogic
    gameData: GameData
    gameUpdate$: Subject<object>
    actionCallbacks: object
    updateCallbacks: object
    
    public constructor(gameData: GameData, actionCallbacks: object, updateCallbacks: object) {
        this.game = new GameLogic(gameData.moveHistory)  
        this.gameData = gameData
        this.gameUpdate$ = new Subject()
        this.actionCallbacks = actionCallbacks
        this.updateCallbacks = updateCallbacks


        this.gameUpdate$.subscribe(update => this.handleUpdate(update))

        this.gameUpdate$.next({message: "initialized"})
    }

    public handleAction(client: any, action: object) {
        this.actionCallbacks[action.message](this, client, action)
    }

    private handleUpdate(update: object) {
        this.updateCallbacks[update.message](this, update)
    }
    
    validateUser(userId: number) {
        return this.gameData.validUsers.includes(userId)
    }

    get activeUser() {
        return this.game.currentPlayer === 1 ? this.gameData.firstUserId : this.gameData.secondUserId
    }

    processMove(columnNumber: number) {
        const newMove = this.game.newMove(columnNumber)
        this.gameUpdate$.next({message: "new-move", payload: newMove})
    }

    get serializedGameState() {
        return {
            movesHistory: this.game.movesHistory,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        }
    }

    serializeMove(newMove) {
        return {
            newMove,
            validMoves: this.game.validMoves,
            currentPlayer: this.game.currentPlayer,
            gameStatus: this.game.gameStatus
        }
    }
}

export default GameSession