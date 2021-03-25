const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../../firebaseInitializer.js');
// const initIngame = require('../../utils/initIngame.js');


module.exports = (data, socket) => { 
    console.log(data);
    data=data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {roomId, user} = data;
    // let ref = firebase.database.ref(`Ingame`);
    let refIngame = firebase.database.ref(`Ingame/${roomId}`);
    // let refRooms = firebase.database.ref(`Rooms/${roomId}`);
    socket.join(roomId);

    // initIngame(roomId);

    refIngame.once("value",
        (snapshot) => {
            console.log("!!!");
            console.log(snapshot.val());

            let {player, suffle, capacity} = snapshot.val();
                try{
                    console.log(player[player.findIndex(findUser)].order);
                    let userOrder = player[player.findIndex(findUser)].order;

                    emitCardgive(capacity, userOrder, suffle);
                    socket.emit("playerorder",JSON.stringify({player}));


                }catch (error) {
                    console.log("error : "+ error);
                }
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


