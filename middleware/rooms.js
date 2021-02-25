const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');
const userlist = require('../control/rooms/userlist.js');
const exit = require('../control/rooms/exit.js');


module.exports = (rooms) => {
    rooms.on('connection', (socket) => {
        console.log('/rooms namespace connected!!');

        socket.on('roomlist', (noData) => active(socket));
        socket.on('create', (reqData) => create(reqData, socket));
        socket.on('join', (reqData) => {
            reqData = reqData.replace(/'/g, '"');
            console.log(reqData);
            var request = JSON.parse(reqData);
            var result = join(reqData, rooms);

            var userInfo = request.userInfo;
            socket.join(request.roomId);
            // rooms.to(request.roomId).emit('userlist', result);

            socket.on('disconnect', () => {
                console.log('chat 네임스페이스 접속 해제');
                rooms.leave(request.roomId);
                exit(reqData);
            })
        });
        console.log("우왕");
    })
}