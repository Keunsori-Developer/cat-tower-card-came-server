const firebase = require("../firebaseInitializer.js");

//init ingame db
module.exports = (roomId) => {
    let refRooms = firebase.database.ref(`Rooms/${roomId}`);
    let ref = firebase.database.ref(`Ingame`);

    refRooms.once("value",
    (snapshot) => {
        console.log("!!!");
        console.log(snapshot.val());

        if(snapshot.val()===null){
            console.log(`error : cant find ${roomId} room`);
            return
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
        for(let i = 0;i<58;i++){
            newBoard[i] = 0;
        }

        ref.child(roomId).set({
            name : name,
            round : 0,
            order : 0,
            capacity : capacity,
            board : newBoard,
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
}



