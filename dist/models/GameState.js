"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const GridMap_1 = require("./GridMap");
const columnNumbers = [0, 1, 2, 3, 4, 5, 6];
const rowNumbers = [0, 1, 2, 3, 4, 5];
class GameState {
    constructor(pieceMap, _complete, _currentPlayer, _winner) {
        this.pieceMap = pieceMap;
        this._complete = _complete;
        this._currentPlayer = _currentPlayer;
        this._winner = _winner;
    }
    static initial() {
        return new GameState(new GridMap_1.GridMap(), false, 1, null);
    }
    static fromMoveHistory(moveHistory) {
        let gameState = GameState.initial();
        for (let move of moveHistory) {
            gameState = gameState.nextState(move);
        }
        return gameState;
    }
    get complete() {
        return this._complete;
    }
    get currentPlayer() {
        return this._currentPlayer;
    }
    get nextPlayer() {
        return this.currentPlayer === 1 ? 2 : 1;
    }
    get winner() {
        return this._winner;
    }
    get pieceCount() {
        return this.pieceMap.size;
    }
    get validMoves() {
        if (this.complete) {
            return [];
        }
        else {
            return columnNumbers.filter(c => !this.pieceAtCoordinate([c, 5]));
        }
    }
    pieceAtCoordinate(coordinate) {
        return this.pieceMap.get(coordinate);
    }
    nextState(columnNumber) {
        const rowNumber = this.getRowForValidColumn(columnNumber);
        const newPieceMap = this.pieceMap.set([columnNumber, rowNumber], this.currentPlayer);
        if (this.hasCompletingMoveAt([columnNumber, rowNumber])) {
            return new GameState(newPieceMap, true, this.nextPlayer, this.currentPlayer);
        }
        else if (newPieceMap.size === 42) {
            return new GameState(newPieceMap, true, this.nextPlayer, null);
        }
        else {
            return new GameState(newPieceMap, false, this.nextPlayer, null);
        }
    }
    getRowForValidColumn(columnNumber) {
        if (columnNumber < 0 || columnNumber > 6) {
            throw ("Invalid Move: not a column");
        }
        if (this.complete) {
            throw ("Invalid Move: game complete");
        }
        const rowNumber = rowNumbers.find(r => this.pieceAtCoordinate([columnNumber, r]) === null);
        if (!rowNumber && rowNumber !== 0) {
            throw ("Invalid Move: column full");
        }
        return rowNumber;
    }
    hasCompletingMoveAt(coordinate) {
        const adjacencyDetails = this.pieceMap.takeNeighborsWhile(coordinate, (value) => value === this.currentPlayer);
        const directionPairs = [["up", "down"], ["left", "right"], ["upLeft", "downRight"], ["downLeft", "upRight"]];
        return directionPairs.some(([dir1, dir2]) => adjacencyDetails[dir1].length + adjacencyDetails[dir2].length >= 3);
    }
}
exports.GameState = GameState;
