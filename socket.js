const SocketIO = require('socket.io');

module.exports = (server, app) => {
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

    let playerOrder = [];
    let order = 0;
    let round = 0;
    let userCount = 1;
    let userIngame = 0;
    let capacity = 2;

    ingame.on('connection', (socket) => {
        console.log('ingame 네임스페이스에 접속');
        userIngame++;

        socket.on('disconnect', () => {
            console.log('ingame 네임스페이스 접속 해제');
        });

        /*********skeleton code***********/

        socket.on('start', (data) => { 
            console.log(data);
            let {roomId, round, user} = data;
            //DB

            playerOrder.push( { userInfo : user, order : userCount , socketid: socket.id });
            console.log(playerOrder);

            socket.join(roomId);
            // ingame.to(roomId).emit( 'start', `{round : ${round} , user : ${user} }`)
            // card suffle
            //서버의 경우 모든 클라에게서 /ingame/start 를 받아야 반대로 /ingame/cardgive 와 /ingame/playerorder 를 전달함
            socket.emit('cardgive',  `{
                breedA : 2,
                breedB : 1,
                breedC : 0,
                breedD : 1,
                breedE : 2,
                breedS : 0, 
            }` )
            if(userIngame === capacity){
                ingame.to(roomId).emit('playerorder', playerOrder );
            }          

        });


        // 다른 이벤트들도 방정보를 계속 받아야함

        
        socket.on('throw', (data) => { 
            console.log(data);
            let {user, card} = data;
            //DB

            // ingame.to(roomId).emit('status', `{ user : ${UserInfo}, card : ${CardInfo} }` )
            socket.emit('status', `{ user : ${user}, card : ${card} }` );
        });

        socket.on('giveup', (data) => { 
            console.log(data);
            let user = data;

            //DB

            // ingame.to(roomId).emit('status', UserInfo );
            socket.emit('status', user );
        });


        ingame.interval = setInterval(() => {
            socket.emit('sequence', "sequence" );
        },20000);

        socket.on('finish', (data) => { 
            console.log(data);
            //DB
            // ingame.to(roomId).emit('result', "" )
            socket.emit('result', "resulut" )
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