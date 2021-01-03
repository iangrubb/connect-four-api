"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require("socket.io");
const CORS_CONFIG = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
