"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridMap = void 0;
const immutable_1 = require("immutable");
const keyFromCoordinate = (coordinate) => `${coordinate[0]},${coordinate[1]}`;
const directions = {
    up: [0, 1],
    upRight: [1, 1],
    right: [1, 0],
    downRight: [1, -1],
    down: [0, -1],
    downLeft: [-1, -1],
    left: [-1, 0],
    upLeft: [-1, 1]
};
class GridMap {
    constructor(map = immutable_1.Map()) {
        this.map = map;
    }
    get(coordinate) {
        return this.map.get(keyFromCoordinate(coordinate), null);
    }
    set(coordinate, value) {
        return new GridMap(this.map.set(keyFromCoordinate(coordinate), value));
    }
    get size() {
        return this.map.size;
    }
    takeNeighborsInDirectionWhile([x, y], direction, cb) {
        const [dx, dy] = directions[direction];
        const neighbors = [];
        x += dx;
        y += dy;
        let neighborValue = this.get([x, y]);
        while (cb(neighborValue, [x, y])) {
            neighbors.push(neighborValue);
            x += dx;
            y += dy;
            neighborValue = this.get([x, y]);
        }
        return neighbors;
    }
    takeNeighborsWhile(coordinate, cb) {
        const neighborSequences = {};
        const keys = Object.keys(directions);
        for (let key of keys) {
            neighborSequences[key] = this.takeNeighborsInDirectionWhile(coordinate, key, cb);
        }
        return neighborSequences;
    }
}
exports.GridMap = GridMap;
