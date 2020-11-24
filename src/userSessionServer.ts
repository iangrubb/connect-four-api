import { fromEvent } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'

class UserSessionServer {

    io: any
    connection$: any
    disconnect$: any

    constructor(io: any){
        this.io = io
        this.connection$ = fromEvent(io, "connection").pipe(map(client => ({io, client})))
        this.disconnect$ = this.connection$.pipe(
            mergeMap(({ client }) => fromEvent(client, "disconnect").pipe(
                map(() => client)
            ))
        )

        this.connection$.subscribe( (conn: any) => console.log(conn.client.id))
        this.disconnect$.subscribe( (client: any) => console.log(client.id))
    }

}

export default UserSessionServer