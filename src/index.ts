import express from 'express'

import UserSessionManager from './userSessionManager'
import GameSessionManager from './gameSessionManager'

const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

const gameSessionManager = new GameSessionManager(io)

const userSessionManager = new UserSessionManager(gameSessionManager)

io.on("connection", (socket: any) => {
    userSessionManager.processSocket(socket)
})

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))