
import { from, fromEvent, Subject, BehaviorSubject, of, Observable, interval } from 'rxjs'
import { map, mergeMap,  filter, mapTo, multicast, switchMap, take, takeUntil, refCount, startWith, mergeAll } from 'rxjs/operators'

interface Connection {
    io: any,
    client: any
}

class UserSessionServer {

    io$: any
    connection$: any
    disconnect$: any
    validConnection$: any

    constructor(io: any){

        this.io$ = of(io)

        this.connection$ =
            this.io$.pipe(
                switchMap(io => fromEvent(io, "connection").pipe(
                    map((client: any): Connection => ({io, client}))
                ))
            )

        this.disconnect$ =
            this.connection$.pipe(
                mergeMap(({ client }) => fromEvent(client, "disconnect").pipe(
                    mapTo(client)
                ))
            )

        this.validConnection$ =
            this.connection$.pipe(
                mergeMap((conn: Connection) => from(UserSessionServer.validateSession(conn.client.handshake.query.userId)).pipe(
                    filter(result => result),
                    mapTo(conn)
                )),
                multicast(new Subject())
            )

        // Creating Subscriptions
        
        this.connection$.subscribe((conn: any) => console.log("Connection:", conn.client.id))
        this.disconnect$.subscribe((client: any) => console.log("Disconnect:", client.id))

        this.validConnection$.subscribe(({client}) => {
            console.log("Admitting valid:", client.id)
            client.emit("admit")
        })
                          
        this.validConnection$.connect()

    }

    streamClientEvent(event: string) {
        return this.validConnection$.pipe(
            mergeMap(({io, client}) => fromEvent(client, event).pipe(
                takeUntil(fromEvent(client, "disconnect")),
                map(data => ({ io, client, data }))
            ))
        )
    }

    static validateSession(id: string): Promise<boolean> {
        return new Promise(resolve => {

            // Perform real validation later

            console.log("Validating:", id)
            const idNumber = parseInt(id)
            setTimeout(() => resolve(idNumber === 1), 200)
        })
    }
}

export default UserSessionServer