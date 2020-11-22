"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameLogic {
    constructor(movesHistory = []) {
        this.movesHistory = [];
        this.isComplete = false;
        this.columns = [[], [], [], [], [], [], []];
        movesHistory.forEach((columnNumber) => {
            this.newMove(columnNumber);
        });
    }
    get gameStatus() {
        let winner;
        if (!this.isComplete) {
            winner = null;
        }
        else if (this.currentPlayer === 1) {
            winner = 2;
        }
        else {
            winner = 1;
        }
        return { isComplete: this.isComplete, winner };
    }
    get turnNumber() {
        return this.movesHistory.length + 1;
    }
    get currentPlayer() {
        return ((this.turnNumber - 1) % 2) + 1;
    }
    get previousPlayer() {
        return this.currentPlayer === 1 ? 2 : 1;
    }
    get validMoves() {
        return this.columns
            .map((c, idx) => ({ idx, c }))
            .filter(res => res.c.length < 6)
            .map(res => res.idx);
    }
    isValidMove(columnNumber) {
        return !this.gameStatus.isComplete && this.validMoves.includes(columnNumber);
    }
    newMove(columnNumber) {
        if (columnNumber < 0 || columnNumber > 6)
            throw ("Valid moves are numbers from 0 to 6");
        if (this.isComplete)
            throw ("A completed game can't accept new moves");
        if (this.columns[columnNumber].length >= 6)
            throw ("A column can have at most 6 pieces");
        this.columns[columnNumber].push(this.currentPlayer);
        const newMove = { player: this.currentPlayer, row: this.columns[columnNumber].length - 1, column: columnNumber, turnNumber: this.turnNumber };
        this.movesHistory.push(newMove);
        this.checkComplete();
        return newMove;
    }
    get rows() {
        const rows = [[], [], [], [], [], []];
        this.columns.forEach(column => {
            rows.forEach((row, idx) => {
                row.push(column[idx]);
            });
        });
        return rows;
    }
    get rightDiagonals() {
        const diagonals = [[], [], [], [], [], [], [], [], [], [], [], []];
        this.columns.forEach((column, cIdx) => {
            diagonals.forEach((diagonal, dIdx) => {
                if (dIdx >= cIdx && dIdx < cIdx + 6) {
                    const coordinate = 5 + cIdx - dIdx;
                    diagonal.push(column[coordinate]);
                }
            });
        });
        return diagonals;
    }
    get leftDiagonals() {
        const diagonals = [[], [], [], [], [], [], [], [], [], [], [], []];
        this.columns.forEach((column, cIdx) => {
            diagonals.forEach((diagonal, dIdx) => {
                if (dIdx >= cIdx && dIdx < cIdx + 6) {
                    const coordinate = dIdx - cIdx;
                    diagonal.push(column[coordinate]);
                }
            });
        });
        return diagonals;
    }
    findConcentrations(quantity, space, player) {
        if (quantity > space)
            return [];
        let concentrations = [];
        for (let idx = 0; idx < this.columns.length; idx++) {
            const column = [...this.columns[idx]];
            while (column.length < 6) {
                column.push(undefined);
            }
            const result = GameLogic.findConcentrationsInArray(column, quantity, space, player);
            concentrations = concentrations.concat(result.map(r => (Object.assign({ direction: "column", idx }, r))));
        }
        for (let idx = 0; idx < this.rows.length; idx++) {
            const row = this.rows[idx];
            const result = GameLogic.findConcentrationsInArray(row, quantity, space, player);
            concentrations = concentrations.concat(result.map(r => (Object.assign({ direction: "row", idx }, r))));
        }
        for (let idx = 0; idx < this.rightDiagonals.length; idx++) {
            const diagonal = this.rightDiagonals[idx];
            const result = GameLogic.findConcentrationsInArray(diagonal, quantity, space, player);
            concentrations = concentrations.concat(result.map(r => (Object.assign({ direction: "rightDiagonal", idx }, r))));
        }
        for (let idx = 0; idx < this.leftDiagonals.length; idx++) {
            const diagonal = this.leftDiagonals[idx];
            const result = GameLogic.findConcentrationsInArray(diagonal, quantity, space, player);
            concentrations = concentrations.concat(result.map(r => (Object.assign({ direction: "leftDiagonal", idx }, r))));
        }
        return concentrations;
    }
    static findConcentrationsInArray(searched, quantity, space, player) {
        let foundCache = [0, 0];
        const otherPlayer = player === 1 ? 2 : 1;
        const concentrations = [];
        searched.forEach((val, idx) => {
            if (val) {
                foundCache[val - 1] = foundCache[val - 1] + 1;
            }
            if (idx >= space) {
                const prev = searched[idx - space];
                if (prev) {
                    foundCache[prev - 1] = foundCache[prev - 1] - 1;
                }
            }
            if (idx + 1 >= space && foundCache[player - 1] >= quantity && foundCache[otherPlayer - 1] === 0) {
                const starting = idx - space + 1;
                concentrations.push({ sequence: searched.slice(starting, idx + 1), starting });
            }
        });
        return concentrations;
    }
    checkComplete() {
        if (this.validMoves.length === 0) {
            this.isComplete = true;
        }
        if (this.findConcentrations(4, 4, this.previousPlayer).length > 0) {
            this.isComplete = true;
        }
    }
}
exports.default = GameLogic;
