"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionCoordinator_1 = __importDefault(require("./sessionCoordinator"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const sessionCoordinator = new sessionCoordinator_1.default(io);
io.on("connection", (socket) => {
    sessionCoordinator.processSocket(socket);
});
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
