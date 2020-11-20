import express from 'express'

import SessionCoordinator from './sessionCoordinator'

const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

const sessionCoordinator = new SessionCoordinator(io)

io.on("connection", (socket: any) => {
    sessionCoordinator.processSocket(socket)
})

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))