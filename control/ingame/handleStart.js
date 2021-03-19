const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../../firebaseInitializer.js');

module.exports = (data, socket) => { 
    console.log(data);
    data=data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {roomId, round, user} = data;
    // let ref = firebase.database.ref(`Ingame`);
    let refIngame = firebase.database.ref(`Ingame/${roomId}`);
    // let refRooms = firebase.database.ref(`Rooms/${roomId}`);
    socket.join(roomId);

    refIngame.once("value",
        (snapshot) => {
            console.log("!!!");
            console.log(snapshot.val());

            let {player, suffle, capacity} = snapshot.val();
            // let lastRound = snapshot.val().round;

            // if(round!==lastRound){
            //     var newBoard = new Array(57);
            //     newBoard[0] = 0;

            //     let suffle = [
            //         "A","A","A","A","A","A","A",
            //         "B","B","B","B","B","B","B",
            //         "C","C","C","C","C","C","C",
            //         "D","D","D","D","D","D","D",
            //         "E","E","E","E","E","E","E",
            //         `S${Math.floor(Math.random() * 3)}`];

            //     suffle.sort(()=>{
            //         return Math.random() - Math.random();
            //     });
            //     console.log(suffle);

            //     for(let i in player){
            //         player[i].giveup == false;
            //     }

            //     refIngame.update({
            //         board : Object.assign({}, newBoard),
            //         order : 0,
            //         round: round,
            //         finishCount : 0,
            //         player,
            //         suffle
            //     }, (error) => {
            //         if (error) {
            //             console.log("Data could not be saved." + error);
            //         } else {
            //             console.log("Data created successfully.");
            //             try{
            //                 console.log(player[player.findIndex(findUser)].order);
            //                 let userOrder = player[player.findIndex(findUser)].order;
        
            //                 emitCardgive(capacity, userOrder, suffle);
            //                 socket.emit("playerorder",JSON.stringify({player}));
        
        
            //             }catch (error) {
            //                 console.log("error : "+ error);
            //             }
            //         }
            //     });  
            // } else {
                try{
                    console.log(player[player.findIndex(findUser)].order);
                    let userOrder = player[player.findIndex(findUser)].order;

                    emitCardgive(capacity, userOrder, suffle);
                    socket.emit("playerorder",JSON.stringify({player}));


                }catch (error) {
                    console.log("error : "+ error);
                }
            // }
        },
        (error) => {
            console.log("The read failed: " + error.code);
        });






        let emitCardgive = (capacity, userOrder, suffle) => {
            let getCard = parseInt(36/capacity);

            if(capacity === 5){
                if(userOrder === 0){

                    socket.emit("cardgive", JSON.stringify({cards : suffle.slice( userOrder * getCard, (userOrder+1) * getCard + 1)}));
                } else {
                    socket.emit("cardgive", JSON.stringify({cards : suffle.slice( userOrder * getCard + 1, (userOrder+1) * getCard + 1)}));
                }
            } else{
                socket.emit("cardgive", JSON.stringify({cards :  suffle.slice( userOrder * getCard, (userOrder+1) * getCard) }));
            }
        }

        let findUser = (element) => {
            if(element.userInfo.mid === user.mid){
                return true;
            }
        }

}


