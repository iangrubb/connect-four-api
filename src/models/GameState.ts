
import { Map } from 'immutable'

type PlayerId = 1 | 2

type ColumnNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

type RowNumber = 0 | 1 | 2 | 3 | 4 | 5

type Coordinate = [ColumnNumber, RowNumber]

type TurnState = {complete: false, currentPlayer: PlayerId} | {complete: true, winningPlayer: PlayerId}

export class GameState {

    turnState: TurnState = {complete: false, currentPlayer: 1}
    pieceMap: Map<Coordinate, PlayerId> = Map() 

    static initial(): GameState {
        return new GameState()
    }

    

}