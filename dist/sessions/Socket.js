"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQueryParams = exports.getQueryParams = void 0;
exports.getQueryParams = (socket) => socket.handshake.query;
exports.updateQueryParams = (socket, updateParams) => {
    socket.handshake.query = Object.assign(Object.assign({}, socket.handshake.query), updateParams);
};
