const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');
const userlist = require('../control/rooms/userlist.js');
const exit = require('../control/rooms/exit.js');


function WebSocketRooms(rooms) {
    rooms.on('connection', (socket) => {
        console.log('rooms namespace connected');

        rooms.on('join', (reqJson) => {
            console.log(reqJson);
            var request = JSON.parse(reqJson);
            var result = join(reqJson);
            var userInfo = request.userInfo;
            rooms.join(request.roomId);

            rooms.to(request.roomId).emit('userlist', userlist);

            rooms.on('disconnect', () => {
                console.log('chat 네임스페이스 접속 해제');
                rooms.leave(roomId);
                exit(reqJson);
            })
        });
    })
}

exports.WebSocketRooms = WebSocketRooms;