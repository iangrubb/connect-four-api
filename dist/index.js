"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSessionServer_1 = __importDefault(require("./userSessionServer"));
const gameSessionServer_1 = __importDefault(require("./gameSessionServer"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io");
const CORS_CONFIG = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};
const userSessionServer = new userSessionServer_1.default(io(server, CORS_CONFIG));
const gameSessionServer = new gameSessionServer_1.default(userSessionServer);
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
