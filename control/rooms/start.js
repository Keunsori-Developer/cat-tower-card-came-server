const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')
const Enum = require('../../utils/enums.js');
const jsonConverter = require('../../utils/jsonStringConverter.js');

module.exports = (req, socket, rooms) => {
    var request = jsonConverter(req);
    console.log("게임 시작 요청됨");
    console.log(request);
    let ref = firebase.database.ref("Rooms");
    ref.orderByKey()
        .equalTo(request.roomId)
        .once("value",
            function (snapshot) {
                if (snapshot.numChildren() === 0) {
                    console.log("그런 방은 없습니다");
                    return;
                }

                var refData = new Object();

                snapshot.forEach(function (data) {
                    refData = data.val();
                    return true;
                });

                if (refData.hostInfo.mid !== request.hostInfo.mid) {
                    console.log("방장이 아니라 유효한 요청이 아님");
                    return;
                }
                console.log("!!!");
                console.log(request.roomId);
                var response = new Object();
                response.roomId = request.roomId;
                rooms.to(request.roomId).emit("start", JSON.stringify(response));

                ref.child(request.roomId).update({
                        "status": "playing"
                    });

                //init ingame db
                let refIngame = firebase.database.ref(`Ingame/${roomId}`);
                let refRooms = firebase.database.ref(`Rooms/${roomId}`);

                refRooms.once("value",
                    (snapshot) => {
                        console.log("!!!");
                        console.log(snapshot.val());

                        if(snapshot.val()===null){
                            console.log("error");
                            //alert
                            //return
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
                            round : 0,
                            order : 0,
                            capacity : capacity,
                            board : Object.assign({}, newBoard),
                            suffle : suffle,
                            player : player,
                            mode : mode,
                            finishCount : 0
                        }, (error) => {
                            if (error) {
                                console.log("Data could not be saved." + error);
                            } else {
                                console.log("Data created successfully.");
                            }
                        });
                    },
                    (error) => {
                        console.log("The read failed: " + error.code);
                    });

            });
}