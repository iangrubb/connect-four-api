"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSessionManager_1 = __importDefault(require("./userSessionManager"));
const gameSessionManager_1 = __importDefault(require("./gameSessionManager"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const gameSessionManager = new gameSessionManager_1.default(io);
const userSessionManager = new userSessionManager_1.default(gameSessionManager);
io.on("connection", (socket) => {
    userSessionManager.initializeSocket(socket);
});
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
