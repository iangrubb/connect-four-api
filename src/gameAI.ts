import GameLogic from "./gameLogic";

interface Result {
    sequence: any[],
    starting: number,
    direction: string,
    idx: number
}

class GameAI {

    static random(game: GameLogic) {

        const moveIndex = Math.floor(Math.random() * game.validMoves.length)

        return game.validMoves[moveIndex]

    }

    static basic(game: GameLogic) {

        // Tries to stop you from winning and tries to win itself, otherwise is random.

        const getPoint = (result: Result) => {

            const emptyIndex = result.sequence.findIndex(s => !s)

            switch(result.direction) {
                case 'column':
                    return {column: result.idx, row: result.starting + emptyIndex}
                case 'row':
                    return {column: result.starting + emptyIndex, row: result.idx}
                case 'rightDiagonal':
                    return {
                        column: Math.max(0, result.idx - 5) + result.starting + emptyIndex,
                        row: Math.max(0, 5 - result.idx) +  result.starting + emptyIndex
                    }
                case 'leftDiagonal':


                    return {
                        column: Math.max(0, result.idx - 6) + result.starting + emptyIndex,
                        row: Math.min(6, result.idx) - result.starting - emptyIndex
                    }
                default:
                    return {column: 0, row: 0 }
            }
        }

        const winPlay = game
            .findConcentrations(3, 4, game.currentPlayer)
            .map(getPoint)
            .find(point => game.columns[point.column].length === point.row)

        if (winPlay) {
            return winPlay.column
        }

        const lossBlock = game
            .findConcentrations(3, 4, game.previousPlayer)
            .map(getPoint)
            .find(point => game.columns[point.column].length === point.row)

        if (lossBlock) {
            return lossBlock.column
        }

        return GameAI.random(game)
    }
}

export default GameAI