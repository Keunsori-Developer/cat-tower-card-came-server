const SocketIO = require('socket.io');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const firebase = require('./firebaseInitializer.js');


//리팩토링은 나중에

// function writeUserData(userId, name, email, imageUrl) { //write
//     firebase.database().ref('users/' + userId).set({
//       username: name,
//       email: email,
//       profile_picture : imageUrl
//     });
//   }


//   function writeNewPost(uid, username, picture, title, body) {
//     // A post entry.
//     var postData = {
//       author: username,
//       uid: uid,
//       body: body,
//       title: title,
//       starCount: 0,
//       authorPic: picture
//     };
  
//     // Get a key for a new Post.
//     var newPostKey = firebase.database().ref().child('posts').push().key;
  
//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     var updates = {};
//     updates['/posts/' + newPostKey] = postData;
//     updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
//     return firebase.database().ref().update(updates);
//   }


//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   }, (error) => {
//     if (error) {
//       // The write failed...
//     } else {
//       // Data saved successfully!
//     }
//   });




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

    function userInfo( mid, nickname )  {
        this.mid = mid;
        this.nickname = nickname;
    }
    function roomInfo (id, name, joined, capacity, hostInfo) {
        this.id = id;
        this.name = name;
        this.joined = joined;
        this.capacity = capacity;
        this.hostInfo = hostInfo;
    }
    function cardInfo( mid, nickname )  {
        this.mid = mid;
        this.nickname = nickname;
    }


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

                                let suffle = ["A","A","A","A","A","A","A","B","B","B","B","B","B","B","C","C","C","C","C","C","C","D","D","D","D","D","D","D","E","E","E","E","E","E","E",`S${Math.floor(Math.random() * 3)}`];
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
                                            order : i,
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
                                    // socket.emit('result', "error" )
                                    console.log(error);
                                });
                                
                                socket.emit("cardgive",suffle);
                                socket.emit("playerorder",player);

                            },
                            (error) => {
                                console.log("The read failed: " + error.code);
                            });
                    } else {
                        let {player, suffle} = snapshot.val();
                        console.log(player, suffle);
                        socket.emit("cardgive",suffle);
                        socket.emit("playerorder",player);
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

            //         });



            // ingame.to(roomId).emit( 'start', `{round : ${round} , user : ${user} }`)
            // card suffle
            //서버의 경우 모든 클라에게서 /ingame/start 를 받아야 반대로 /ingame/cardgive 와 /ingame/playerorder 를 전달함

            // if(userIngame === capacity){
            //     ingame.to(roomId).emit('playerorder', playerOrder );
            // }          

        });


        // 다른 이벤트들도 방정보를 계속 받아야함




        
        socket.on('throw', (data) => { 
            console.log(data);
            let {user, card, roomId, round} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.on("value", (snapshot) => {
                console.log(snapshot.val());
                
                let {order, capacity, board, userList} = snapshot.val();
                order++;
                order = order % capacity;  
                board[card.index] = card.breed;

                ref.update({
                    board : board,
                    order : order
                });

                // socket.emit('status', `{ user : ${user}, card : ${card} }` );
                ingame.to(roomId).emit( 'status', {round : round , user : user , board : board , card, order, userList})


              }, (errorObject) => {
                console.log("The read failed: " + errorObject.code);
              });
            


            // ingame.to(roomId).emit('status', `{ user : ${UserInfo}, card : ${CardInfo} }` )
            // socket.emit('status', `{ user : ${user}, card : ${card} }` );
        });
        




        socket.on('giveup', (data) => { 
            console.log(data);
            let {user, card, roomId} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.on("value", (snapshot) => {
                console.log(snapshot.val());
                
                let {order, capacity, board, round, player} = snapshot.val();
                order++;
                order = order % capacity;  

                function findUser(element) {
                    if(element.userInfo === user){
                        return true;
                    }
                }
                player[player.findIndex(findUser)].giveup = true;



                ref.update({
                    player,
                    order 
                });

                // socket.emit('status', `{ user : ${user}, card : ${card} }` );
                ingame.to(roomId).emit( 'status', {round : round , user : user , board : board , card, order, player})


              }, (errorObject) => {
                console.log("The read failed: " + errorObject.code);
              });
        });



        socket.on('finish', (data) => { 
            console.log(data);
            let {user, round, roomId, leftCard} = data;

            let ref = firebase.database.ref(`Ingame/${roomId}`);
            ref.on("value", (snapshot) => {
                console.log(snapshot.val());
                
                let {round, player} = snapshot.val();


                function findUser(element) {
                    if(element.userInfo === user){
                        return true;
                    }
                }
                player[player.findIndex(findUser)].score = leftCard * (-1);

                ref.update({
                    player 
                });

                // socket.emit('status', `{ user : ${user}, card : ${card} }` );
                ingame.to(roomId).emit( 'result', {player})
                // ref.remove();

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