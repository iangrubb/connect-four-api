import express from 'express'

import { UserSessionServer } from './servers/UserSessionServer'


const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")

const CORS_CONFIG = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}

const socketServer = io(server, CORS_CONFIG)

const userSessionServer = new UserSessionServer(socketServer)

userSessionServer.run()

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))