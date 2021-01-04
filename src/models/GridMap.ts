import { Map } from 'immutable'

export type Coordinate = [number, number]

const keyFromCoordinate = (coordinate: Coordinate): string => `${coordinate[0]},${coordinate[1]}`

const directions = {
    up: [0, 1],
    upRight: [1, 1],
    right: [1, 0],
    downRight: [1, -1],
    down: [0, -1],
    downLeft: [-1, -1],
    left: [-1, 0],
    upLeft: [-1, 1]
}

export type Direction = keyof typeof directions

type NeighboringSequences<T> = {
    [key in Direction]: (T | null)[]
}

export class GridMap<T> {

    constructor(public map: Map<string, T> = Map()) {}

    get(coordinate: Coordinate): T | null {
        return this.map.get(keyFromCoordinate(coordinate), null)
    } 

    set(coordinate: Coordinate, value: T): GridMap<T> {
        return new GridMap<T>(this.map.set(keyFromCoordinate(coordinate), value))
    }

    get size(): number {
        return this.map.size
    } 

    takeNeighborsInDirectionWhile([x, y]: [x: number, y: number], direction: Direction, cb: (value: T | null, coordinate: Coordinate) => boolean ): (T | null)[] {

        const [dx, dy] = directions[direction]
        const neighbors = []

        x += dx
        y += dy
        let neighborValue = this.get([x, y])

        while(cb(neighborValue, [x, y])) {
            neighbors.push(neighborValue)
            x += dx
            y += dy
            neighborValue = this.get([x, y])
        }

        return neighbors
    }

    takeNeighborsWhile(coordinate: Coordinate, cb: (value: T | null, coordinate: Coordinate) => boolean): NeighboringSequences<T> {

        const neighborSequences = {} as NeighboringSequences<T>

        const keys = Object.keys(directions) as Direction[]

        for (let key of keys) {
            neighborSequences[key] = this.takeNeighborsInDirectionWhile(coordinate, key, cb)
        }

        return neighborSequences
    }
}