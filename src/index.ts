import express from 'express'

import { GameState } from './models/GameState'

console.log(new GameState())





const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")

const CORS_CONFIG = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))