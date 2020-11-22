import GameLogic from "./gameLogic";

class GameAI {

    static random(game: GameLogic) {

        const moveIndex = Math.floor(Math.random() * game.validMoves.length)

        return game.validMoves[moveIndex]

    }

    static basic(game: GameLogic) {

        // Tries to stop you from winning and tries to win itself, otherwise is random.

        const info = game.findConcentration(3, 4, game.previousPlayer)

        console.log(info)

        return GameAI.random(game)

    }

}

export default GameAI