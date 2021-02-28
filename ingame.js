const SocketIO = require('socket.io');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const firebase = require('./firebaseInitializer.js');

const handleStart = require('./ingame_utils/handleStart');
const handleGiveup = require('./ingame_utils/handleGiveup');
const handleThrow = require('./ingame_utils/handleThrow');
const handleFinish = require('./ingame_utils/handleFinish');


module.exports = () => {

    const app = express();
    app.set('port',  process.env.PORT || 8005);
    app.set('view engine', 'html');
    nunjucks.configure('views', {
        express: app,
        watch: true,
    });
    
    app.use(morgan('dev'));
    app.use(express.json());

    
    app.use('/', indexRouter);
    
    app.use((req, res, next) => {
        const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
        error.status = 404;
        next(error);
    });
    
    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error =  process.env.NODE_ENV !== 'production' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });
    
    const server = app.listen(app.get('port'), () => {
        console.log(app.get('port'),'번 포트에서 대기중');
    });
    
    const io = SocketIO(server, { path: '/socket.io'});
    app.set('io',io);
    const ingame = io.of('/ingame');


    ingame.on('connection', (socket) => {
        console.log('ingame 네임스페이스에 접속');
        

        socket.on('disconnect', () => {
            console.log('ingame 네임스페이스 접속 해제');
            // 탈주처리
        });

        socket.on('start', (data) => handleStart(data, socket));
        socket.on('throw', (data) => handleThrow(data, ingame));
        socket.on('giveup', (data) => handleGiveup(data, ingame));
        socket.on('finish', (data) => handleFinish(data, ingame));

    });
};