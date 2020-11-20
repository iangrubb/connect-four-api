import GameLogic from "./gameLogic";

class GameAI {

    static random(game: GameLogic) {

        GameAI.checkComplete(game)

        const moveIndex = Math.floor(Math.random() * game.validMoves.length)

        return game.validMoves[moveIndex]

    }

    static checkComplete(game: GameLogic) {
        if (game.isComplete) throw("AI can't recommend a move for a completed game")
    }

}

export default GameAI