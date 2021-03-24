const firebase = require("../firebaseInitializer.js");

//init ingame db
module.exports = (roomId) => {
    let refIngame = firebase.database.ref(`Ingame/${roomId}`);
    let ref = firebase.database.ref(`Ingame`);

    refIngame.once("value",
    (snapshot) => {
        console.log("!!!");
        console.log(snapshot.val());

        if(snapshot.val()===null){
            console.log(`error : cant find ${roomId} room`);
            return
        }

        let {finishCount , player, round, order} = snapshot.val();


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


        player.sort(()=>{
            return Math.random() - Math.random();
        });

        for(let i in player){
            player[i].giveup = false;
            player[i].order = Number(i);
        }

        var newBoard = new Array(57);
        for(let i = 0;i<58;i++){
            newBoard[i] = 0;
        }

        ref.child(roomId).update({
            round : ++round,
            order : 0,
            board : newBoard,
            suffle : suffle,
            player : player,
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



