import express from 'express'

import GameLogic from './gameLogic'

import UserSessionServer from './userSessionServer'
import GameSessionServer from './gameSessionServer'

import { from, fromEvent, Subject, BehaviorSubject, of, Observable, interval } from 'rxjs'
import { map, mergeMap,  filter, mapTo, multicast, switchMap, take, takeUntil, refCount, startWith, mergeAll } from 'rxjs/operators'
import GameSession from './gameSessionTypes/gameSession'

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

const gameSessionServer = new GameSessionServer(userSessionServer)

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))