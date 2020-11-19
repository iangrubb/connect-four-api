"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameLogic_1 = __importDefault(require("./gameLogic"));
const sessionCoordinator_1 = __importDefault(require("./sessionCoordinator"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const calculateMovesRecord = game => {
    const columnHeights = [0, 0, 0, 0, 0, 0, 0];
    return game.movesHistory.map((column, idx) => {
        const player = (idx % 2) + 1;
        const result = { player, column, row: columnHeights[column], moveNumber: idx + 1 };
        columnHeights[column]++;
        return result;
    });
};
const serializeGame = game => {
    return {
        movesRecord: calculateMovesRecord(game),
        validMoves: game.validMoves,
        currentPlayer: game.currentPlayer,
        gameStatus: game.gameStatus
    };
};
const sessionCoordinator = new sessionCoordinator_1.default();
io.on("connection", (socket) => {
    sessionCoordinator.processSocket(socket);
    const game = new gameLogic_1.default();
    socket.on("new-move", (column) => {
        game.processMove(column);
        socket.emit("game-state", serializeGame(game));
    });
    socket.emit("game-state", serializeGame(game));
});
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
