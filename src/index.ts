import express from 'express'

import UserSessionServer from './userSessionServer'
import GameSessionServer from './gameSessionServer'

const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")

const CORS_CONFIG = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}

const userSessionServer = new UserSessionServer(io(server, CORS_CONFIG))

new GameSessionServer(userSessionServer)

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))