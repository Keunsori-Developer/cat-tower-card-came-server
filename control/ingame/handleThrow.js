const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../../firebaseInitializer.js');

module.exports = (data, ingame) => { 
    console.log(data);
    data=data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {user, card, roomId} = data;

    let ref = firebase.database.ref(`Ingame/${roomId}`);
    ref.once("value", (snapshot) => {

        let {order, capacity, board, player} = snapshot.val();
        order++;
        order = order % capacity;  

        try{
            while(player[order].giveup === true){
                order++;
                order = order % capacity;
            }



            let parsedUser = user;
            let parsedCard = card;
            function findUser(element) {
                if(element.userInfo.mid === parsedUser.mid){
                    return true;
                }
            }
            if(parsedCard.breed=="S0"){
                player[player.findIndex(findUser)].score += (5);
            }
            board[parsedCard.index] = parsedCard.breed;

            ref.update({
                board : board,
                order : order,
                player
            }, (error) => {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data updated successfully.");
                    ingame.to(roomId).emit('status', JSON.stringify({ user : parsedUser ,player ,board, order, giveup: false}));
                }
            });                
        } catch (error) {
            console.log("parsing error : "+ error);
        }

    }, (errorObject) => {
    console.log("The read failed: " + errorObject.code);
    });
}