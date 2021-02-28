const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../firebaseInitializer.js');

module.exports = (data, ingame) => { 
    console.log(data);
    data=data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {user, roomId} = data;

    let ref = firebase.database.ref(`Ingame/${roomId}`);
    ref.once("value", (snapshot) => {
        console.log(snapshot.val());
        
        let {order, capacity, board, player} = snapshot.val();
        order++;
        order = order % capacity;

        try{
            
            while(player[order].giveup === true){
                order++;
                order = order % capacity;
            }


            // user=user.replace(/'/g,'"');
            // console.log(user, roomId);

            var parsedUser = user;

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
                    ingame.to(roomId).emit('status', { user : parsedUser , player, board, order});
                }
            });                
        }catch (error) {
            console.log("parsing error : "+ error);
        }

      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
}