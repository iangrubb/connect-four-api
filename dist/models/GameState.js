"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const immutable_1 = require("immutable");
const columnNumbers = [0, 1, 2, 3, 4, 5, 6];
const rowNumbers = [0, 1, 2, 3, 4, 5];
const keyFromCoordinate = (coordinate) => {
    const [x, y] = coordinate;
    return `${x}${y}`;
};
class GameState {
    constructor(pieceMap, turnState) {
        this.pieceMap = pieceMap;
        this.turnState = turnState;
    }
    get isComplete() {
        return this.turnState.complete;
    }
    get currentPlayer() {
        return this.turnState.complete ? null : this.turnState.currentPlayer;
    }
    get winningPlayer() {
        return this.turnState.complete ? this.turnState.winningPlayer : null;
    }
    get pieceCount() {
        return this.pieceMap.size;
    }
    get validMoves() {
        if (this.turnState.complete) {
            return [];
        }
        else {
            return columnNumbers.filter(c => !this.pieceAtCoordinate([c, 5]));
        }
    }
    pieceAtCoordinate(coordinate) {
        return this.pieceMap.get(keyFromCoordinate(coordinate), null);
    }
    traverseDirectionFor(coordinate, dx, dy, includedValues) {
        const viewed = [];
        let [x, y] = coordinate;
        x += dx;
        y += dy;
        while (x >= 0 && y >= 0 && x < 7 && y < 6) {
            let targetElement = this.pieceAtCoordinate([x, y]);
            if (includedValues.includes(targetElement)) {
                viewed.push(targetElement);
                x += dx;
                y += dy;
            }
            else {
                return viewed;
            }
        }
        return viewed;
    }
    adjacentSequences(coordinate, includedValues) {
        return {
            up: this.traverseDirectionFor(coordinate, 0, 1, includedValues),
            upRight: this.traverseDirectionFor(coordinate, 1, 1, includedValues),
            right: this.traverseDirectionFor(coordinate, 1, 0, includedValues),
            downRight: this.traverseDirectionFor(coordinate, 1, -1, includedValues),
            down: this.traverseDirectionFor(coordinate, 0, -1, includedValues),
            downLeft: this.traverseDirectionFor(coordinate, -1, -1, includedValues),
            left: this.traverseDirectionFor(coordinate, -1, 0, includedValues),
            upLeft: this.traverseDirectionFor(coordinate, -1, 1, includedValues),
        };
    }
    hasCompletingMove(coordinate) {
        const adjacencyDetails = this.adjacentSequences(coordinate, [this.currentPlayer]);
        const directionPairs = [["up", "down"], ["left", "right"], ["upLeft", "downRight"], ["downLeft", "upRight"]];
        return directionPairs.some(([dir1, dir2]) => adjacencyDetails[dir1].length + adjacencyDetails[dir2].length >= 3);
    }
    nextState(columnNumber) {
        if (columnNumber < 0 || columnNumber > 6) {
            throw ("Invalid Move: not a column");
        }
        if (this.turnState.complete) {
            throw ("Invalid Move: game complete");
        }
        const rowNumber = rowNumbers.find(r => !this.pieceAtCoordinate([columnNumber, r]));
        if (!rowNumber && rowNumber !== 0) {
            throw ("Invalid Move: column full");
        }
        const newPieceMap = this.pieceMap.set(keyFromCoordinate([columnNumber, rowNumber]), this.currentPlayer);
        if (this.hasCompletingMove([columnNumber, rowNumber])) {
            return new GameState(newPieceMap, { complete: true, winningPlayer: this.currentPlayer });
        }
        else {
            return new GameState(newPieceMap, { complete: false, currentPlayer: this.currentPlayer === 1 ? 2 : 1 });
        }
    }
    static initial() {
        return new GameState(immutable_1.Map(), { complete: false, currentPlayer: 1 });
    }
    static fromMoveHistory(moveHistory) {
        let gameState = GameState.initial();
        for (let move of moveHistory) {
            gameState = gameState.nextState(move);
        }
        return gameState;
    }
}
exports.GameState = GameState;
