"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinate = void 0;
const immutable_1 = require("immutable");
class Coordinate {
    constructor(x, y) {
        this.values = immutable_1.List([x, y]);
    }
}
exports.Coordinate = Coordinate;
