import express from 'express'

import UserSessionServer from './userSessionServer'


import { from, fromEvent, Subject } from 'rxjs'
import { map, mergeMap,  filter, mapTo, multicast } from 'rxjs/operators'

// import UserSessionManager from './userSessionManager'
// import GameSessionManager from './gameSessionManager'

const app = express()

const server = require('http').createServer(app)

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
})

// const userSessionServer = new UserSessionServer(io)

interface Connection {
  io: any,
  client: any
}



const simulateValidation = (id: string): Promise<boolean> => new Promise(resolve => {
  console.log("Begin Validating:", id)
  const idNumber = parseInt(id)
  setTimeout(() => resolve(idNumber === 1))
})

const connection$ =
  fromEvent(io, "connection").pipe(
    map( (client: any): Connection => ({io, client}))
  )

const validConnection$ =
  connection$.pipe(
    mergeMap((conn: Connection) =>
      from(simulateValidation(conn.client.handshake.query.userId)).pipe(
        filter(result => result),
        mapTo(conn)
    )))


const validConnectionSource$ = validConnection$.pipe(
  multicast(()=> new Subject())
)



    
    
const disconnect$ =
  connection$.pipe(
    mergeMap(({ client }) => fromEvent(client, "disconnect").pipe(
      map(() => client)
    ))
  )

validConnectionSource$.connect()

validConnectionSource$.subscribe(conn => console.log(conn.client.id))

validConnectionSource$.subscribe(conn => console.log(conn.client.id))




// connection$.subscribe( (conn: any) => console.log(conn.client.id))


// disconnect$.subscribe( (client: any) => console.log(client.id))







// const gameSessionManager = new GameSessionManager(io)

// const userSessionManager = new UserSessionManager(gameSessionManager)

// io.on("connection", (socket: any) => {
//     userSessionManager.initializeSocket(socket)
// })






const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))