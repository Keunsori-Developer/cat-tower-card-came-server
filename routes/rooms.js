const express = require('express');
const create = require('../control/rooms/create.js');
const active = require('../control/rooms/active.js');
const join = require('../control/rooms/join.js');
const userlist = require('../control/rooms/userlist.js');
const exit = require('../control/rooms/exit.js');

const router = express.Router();

router.post('/create', create);
//router.post('/userlist',userlist);
router.get('/active', active);
//router.post('/join', join);
router.post('/exit', exit);

exports.httpRouter = router;

function WebSocketRooms(rooms) {
    rooms.on('connection', (socket) => {
        console.log('rooms namespace connected');

        socket.on('join', (reqJson) => {
            reqJson = reqJson.replace(/'/g, '"');
            console.log(reqJson);
            var request = JSON.parse(reqJson);
            var result = join(reqJson, rooms);

            var userInfo = request.userInfo;
            socket.join(request.roomId);
            // rooms.to(request.roomId).emit('userlist', result);

            socket.on('disconnect', () => {
                console.log('chat 네임스페이스 접속 해제');
                rooms.leave(request.roomId);
                exit(reqJson);
            })
        });
        console.log("우왕");
    })
}

exports.WebSocketRooms = WebSocketRooms;