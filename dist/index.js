"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserSessionServer_1 = require("./servers/UserSessionServer");
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io");
const CORS_CONFIG = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};
const socketServer = io(server, CORS_CONFIG);
const userSessionServer = new UserSessionServer_1.UserSessionServer(socketServer);
userSessionServer.run();
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
