import { Server } from 'socket.io'
import { from, fromEvent, Subject, of, Observable } from 'rxjs'
import { map, mergeMap,  filter, mapTo, multicast, switchMap, takeUntil} from 'rxjs/operators'


interface Connection {
    io: Server,
    client: any
}

class UserSessionServer {

    io$: Observable<Server>
    validConnection$: any

    constructor(io: any){

        this.io$ = of(io)

        this.validConnection$ =
            this.connection$.pipe(
                mergeMap((conn: Connection) => from(UserSessionServer.validateConnection(conn)).pipe(
                    filter(result => result),
                    mapTo(conn)
                )),
                multicast(new Subject())
            )

        this.validConnection$.connect()
        
        this.validConnection$.subscribe(({client}) => {
            client.emit("admit")
        })
    }

    get connection$() {
        return this.io$.pipe(
            switchMap(io => fromEvent(io, "connection").pipe(
                map((client: any): Connection => ({io, client}))
            ))
        )
    }

    clientEventObservable(event: string) {
        return this.validConnection$.pipe(
            mergeMap(({io, client}) => fromEvent(client, event).pipe(
                takeUntil(fromEvent(client, "disconnect")),
                map(data => ({ io, client, data }))
            ))
        )
    }

    static validateConnection(conn: Connection): Promise<boolean> {
        return new Promise(resolve => {

            // Perform real validation later

            const idNumber = parseInt(conn.client.handshake.query.userId)
            setTimeout(() => resolve(idNumber === 1), 200)
        })
    }
}

export default UserSessionServer