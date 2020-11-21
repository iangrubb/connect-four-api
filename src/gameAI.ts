import GameLogic from "./gameLogic";

class GameAI {

    static random(game: GameLogic) {

        const moveIndex = Math.floor(Math.random() * game.validMoves.length)

        return game.validMoves[moveIndex]

    }

}

export default GameAI