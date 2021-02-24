const SocketIO = require('socket.io');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const firebase = require('./firebaseInitializer.js');
const roomsRoutes = require('./routes/rooms');

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
    const rooms = io.of('/rooms');

    roomsRoutes.WebSocketRooms(rooms, io);

    ingame.on('connection', (socket) => {
        console.log('ingame 네임스페이스에 접속');
        

        socket.on('disconnect', () => {
            console.log('ingame 네임스페이스 접속 해제');
        });


        socket.on('start', (data) => { 
            console.log(data);
            let {roomId, round, user} = data;
            let ref = firebase.database.ref(`Ingame`);
            let refIngame = firebase.database.ref(`Ingame/${roomId}`);
            let refRooms = firebase.database.ref(`Rooms/${roomId}`);
            socket.join(roomId);
            refIngame.once("value",
                (snapshot) => {
                    console.log("!!!");
                    console.log(snapshot.val());

                    if(snapshot.val()===null){
                        refRooms.once("value",
                            (snapshot) => {
                                console.log("!!!");
                                console.log(snapshot.val());

                                if(snapshot.val()===null){
                                    console.log("error");
                                }

                                let {capacity, joined, mode, name, userList} = snapshot.val();
        
                                console.log(capacity, joined, mode, name, userList);

                                let suffle = [
                                    "A","A","A","A","A","A","A",
                                    "B","B","B","B","B","B","B",
                                    "C","C","C","C","C","C","C",
                                    "D","D","D","D","D","D","D",
                                    "E","E","E","E","E","E","E",
                                    `S${Math.floor(Math.random() * 3)}`];

                                suffle.sort(()=>{
                                    return Math.random() - Math.random();
                                });
                                console.log(suffle);

                                let player = [];
                                userList.sort(()=>{
                                    return Math.random() - Math.random();
                                });

                                for (let i in userList) {
                                    player.push(
                                        {
                                            userInfo : userList[i],
                                            order : Number(i),
                                            score : 0,
                                            giveup : false
                                        }
                                    )
                                }

                                var newBoard = new Array(57);
                                newBoard[0] = 0;

                                ref.child(roomId).set({
                                    name : name,
                                    round : 1,
                                    order : 1,
                                    currentOrder : 1,
                                    capacity : capacity,
                                    board : newBoard,
                                    suffle : suffle,
                                    player : player,
                                }, (error) => {
                                    if (error) {
                                        console.log("Data could not be saved." + error);
                                    } else {
                                        console.log("Data created successfully.");
                                    }
                                });

                                function findUser(element) {
                                    if(element.userInfo.mid === parsedUser.mid){
                                        return true;
                                    }
                                }

                                try{
                                    var parsedUser = JSON.parse(user);
                                    console.log(parsedUser);
                                    console.log(player[player.findIndex(findUser)].order);
                                    let userOrder = player[player.findIndex(findUser)].order;

                                    socket.emit("cardgive",suffle.slice( userOrder * capacity, (userOrder+1) * capacity));
                                    socket.emit("playerorder",player);
                                }catch (error) {
                                    console.log("parsing error : "+ error);
                                }
                            },
                            (error) => {
                                console.log("The read failed: " + error.code);
                            });
                    } else {
                        let {player, suffle, capacity} = snapshot.val();

                        function findUser(element) {
                            if(element.userInfo.mid === parsedUser.mid){
                                return true;
                            }
                        }

                        try{
                            user=user.replace(/'/g,'"');
                            console.log(user);

                            var parsedUser = JSON.parse(user);
                            console.log(parsedUser);
                            console.log(player[player.findIndex(findUser)].order);
                            let userOrder = player[player.findIndex(findUser)].order;

                            socket.emit("cardgive",suffle.slice( userOrder * capacity, (userOrder+1) * capacity));
                            socket.emit("playerorder",player);
                        }catch (error) {
                            console.log("parsing error : "+ error);
                        }
                    }

                },
                (error) => {
                    console.log("The read failed: " + error.code);
                });

            // ref.orderByChild("status")
            //     .equalTo("active")
            //     .once("value",
            //         function (snapshot) {
            //             console.log("!!!");
            //             console.log(snapshot.val());
            //         },
            //         function (error) {
            //             console.log("The read failed: " + error.code);

            //         }); RKH6E {"mid" : "GWCSE1622", "nickname" : "김창렬"}
      //{'mid' : 'GWCSE1622', 'nickname' : '김창렬'}

        });


        
        socket.on('throw', (data) => { 
            console.log(data);
            let {user, card, roomId} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.once("value", (snapshot) => {

                let {order, capacity, board, userList} = snapshot.val();
                order++;
                // order = order % capacity;  

                try{
                    user=user.replace(/'/g,'"');
                    card=card.replace(/'/g,'"');
                    console.log(user, card);

                    var parsedUser = JSON.parse(user);
                    let parsedCard = JSON.parse(card);

                    board[parsedCard.index] = parsedCard.breed;

                    ref.update({
                        board : board,
                        order : order
                    }, (error) => {
                        if (error) {
                            console.log("Data could not be saved." + error);
                        } else {
                            console.log("Data updated successfully.");
                            socket.emit('status', { parsedUser , parsedCard , board, order});//나중에 ingame.to(roomId)로 바꿔야함
                // ingame.to(roomId).emit( 'status', {round : round , user : user , board : board , card : parsedCard, order, userList})
                        }
                    });                
                }catch (error) {
                    console.log("parsing error : "+ error);
                }

            }, (errorObject) => {
            console.log("The read failed: " + errorObject.code);
            });
        });
        




        socket.on('giveup', (data) => { 
            console.log(data);
            let {user, roomId} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.once("value", (snapshot) => {
                console.log(snapshot.val());
                
                let {order, capacity, board, player} = snapshot.val();
                order++;
                // order = order % capacity;  

                try{
                    user=user.replace(/'/g,'"');
                    console.log(user, roomId);

                    var parsedUser = JSON.parse(user);

                    function findUser(element) {
                        if(element.userInfo.mid === parsedUser.mid){
                            return true;
                        }
                    }

                    player[player.findIndex(findUser)].giveup = true;

                    ref.update({
                        player,
                        order 
                    }, (error) => {
                        if (error) {
                            console.log("Data could not be saved." + error);
                        } else {
                            console.log("Data updated successfully.");
                            socket.emit('status', { parsedUser , player, order});//나중에 ingame.to(roomId)로 바꿔야함
                // ingame.to(roomId).emit( 'status', {round : round , user : user , board : board , card : parsedCard, order, userList})
                        }
                    });                
                }catch (error) {
                    console.log("parsing error : "+ error);
                }

              }, (errorObject) => {
                console.log("The read failed: " + errorObject.code);
              });
        });



        socket.on('finish', (data) => { 
            console.log(data);
            let {user, round, roomId, leftCard} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.once("value", (snapshot) => {
                let {round, player} = snapshot.val();



                try{
                    user=user.replace(/'/g,'"');
                    console.log(user, roomId);

                    var parsedUser = JSON.parse(user);

                    function findUser(element) {
                        if(element.userInfo.mid === parsedUser.mid){
                            return true;
                        }
                    }
                    player[player.findIndex(findUser)].score = leftCard * (-1);

                    ref.update({
                        player  
                    }, (error) => {
                        if (error) {
                            console.log("Data could not be saved." + error);
                        } else {
                            console.log("Data updated successfully.");
                            socket.emit('result', {player});//나중에 ingame.to(roomId)로 바꿔야함
                // ingame.to(roomId).emit( 'status', {round : round , user : user , board : board , card : parsedCard, order, userList})
                        }
                    });                
                }catch (error) {
                    console.log("parsing error : "+ error);
                }
              }, (errorObject) => {
                console.log("The read failed: " + errorObject.code);
              });
        });



    });


    // io.on('connection', (socket) => {
    //     const req = socket.request;
    //     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //     console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        
    //     socket.on('disconnect', () => {
    //         console.log('클라이언트 접속 해제', ip, socket.id);
    //         clearInterval(socket.interval);
    //     });
    //     socket.on('error', (error) => { //error
    //         console.log(error);
    //     });
    //     socket.on('reply', (data) => { 
    //         console.log(data);
    //     });
    //     socket.on('chat', (data) => { 
    //         console.log(data);
    //     });
    //     socket.interval = setInterval(() => {
    //         socket.emit('news', 'Hello Socket IO');
    //     },3000);
    // });
};