import express from 'express'

import GameLogic from './gameLogic'
import SessionCoordinator from './sessionCoordinator'

const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

const calculateMovesRecord = game => {
    const columnHeights = [0, 0, 0, 0, 0, 0, 0]

    return game.movesHistory.map((column: number, idx: number) => {
        const player = (idx % 2) + 1
        const result = {player, column, row: columnHeights[column], moveNumber: idx + 1}
        columnHeights[column]++
        return result
    })
}

const serializeGame = game => {

    return {
        movesRecord: calculateMovesRecord(game),
        validMoves: game.validMoves,
        currentPlayer: game.currentPlayer,
        gameStatus: game.gameStatus
    }

}

const sessionCoordinator = new SessionCoordinator()

io.on("connection", (socket: any) => {


    sessionCoordinator.processSocket(socket)




    
    const game = new GameLogic()

    socket.on("new-move", (column: number) => {

        game.processMove(column)

        socket.emit("game-state", serializeGame(game))
    })

    socket.emit("game-state", serializeGame(game))

})

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))