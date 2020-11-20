"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameLogic {
    constructor(movesHistory = []) {
        this.movesHistory = [];
        this.isComplete = false;
        this.columns = [[], [], [], [], [], [], []];
        movesHistory.forEach((columnNumber) => {
            this.processMove(columnNumber);
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
    get validMoves() {
        return this.columns
            .map((c, idx) => ({ idx, c }))
            .filter(res => res.c.length < 6)
            .map(res => res.idx);
    }
    processMove(columnNumber) {
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
    checkComplete() {
        if (this.validMoves.length === 0) {
            this.isComplete = true;
            return;
        }
        this.columns.forEach(column => {
            if (GameLogic.winInSequence(column)) {
                this.isComplete = true;
                return;
            }
        });
        for (let i = 0; i < 6; i++) {
            const row = this.columns.map(c => c[i]);
            if (GameLogic.winInSequence(row)) {
                this.isComplete = true;
                return;
            }
        }
        for (let i = 3; i < 9; i++) {
            const rightDiagonal = this.columns.map((column, idx) => {
                const row = 5 - i + idx;
                return column[row];
            });
            if (GameLogic.winInSequence(rightDiagonal)) {
                this.isComplete = true;
                return;
            }
        }
        for (let i = 3; i < 9; i++) {
            const leftDiagonal = this.columns.map((column, idx) => {
                const row = i + idx;
                return column[row];
            });
            if (GameLogic.winInSequence(leftDiagonal)) {
                this.isComplete = true;
                return;
            }
        }
    }
    static winInSequence(sequence) {
        for (let i = 0; i <= sequence.length - 4; i++) {
            const segment = sequence.slice(i, i + 4);
            if (segment.every(n => n === 1) || segment.every(n => n === 2)) {
                return true;
            }
        }
        return false;
    }
}
exports.default = GameLogic;
