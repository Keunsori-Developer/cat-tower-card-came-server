const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');
const userlist = require('../control/rooms/userlist.js');
const exit = require('../control/rooms/exit.js');
const ConvertCsharpJson = require('../utils/jsonStringConverter.js');


module.exports = (rooms) => {
    rooms.on('connection', (socket) => {
        console.log('/rooms namespace connected!!');
        var lobbyData = null;
        socket.on('roomlist', (noData) => active(socket));
        socket.on('create', (reqData) => {
            create(reqData, socket);
            lobbyData = ConvertCsharpJson(reqData);
        });
        socket.on('join', (reqData) => {
            join(reqData, socket, rooms);
            lobbyData = ConvertCsharpJson(reqData);
        });
        socket.on('exit', (reqData) => {
            exit(false, reqData, socket, rooms);
            lobbyData = null;
        });
        socket.on('disconnect', () => {
            console.log('/rooms namespace disconnected~');
            if (lobbyData == null) return;
            rooms.leave(lobbyData.roomId);
            exit(true, lobbyData, socket, rooms);
            lobbyData = null;
        })
        console.log("우왕");
    })
}