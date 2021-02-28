const handleStart = require('./control/ingame/handleStart');
const handleGiveup = require('./control/ingame/handleGiveup');
const handleThrow = require('./control/ingame/handleThrow');
const handleFinish = require('./control/ingame/handleFinish');


module.exports = (ingame) => {
    ingame.on('connection', (socket) => {
        console.log('ingame 네임스페이스에 접속');
        

        socket.on('disconnect', () => {
            console.log('ingame 네임스페이스 접속 해제');
        });

        socket.on('start', (data) => handleStart(data, socket));
        socket.on('throw', (data) => handleThrow(data, ingame));
        socket.on('giveup', (data) => handleGiveup(data, ingame));
        socket.on('finish', (data) => handleFinish(data, ingame));

    });
};