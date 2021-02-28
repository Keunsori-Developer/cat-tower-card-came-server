const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../../firebaseInitializer.js');

module.exports = (data, ingame) => { 
    console.log(data);
    data=data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {user, round, roomId, leftCard} = data;

    let ref = firebase.database.ref(`Ingame/${roomId}`);
    ref.once("value", (snapshot) => {
        let {round, player, finishCount, capacity} = snapshot.val();
        finishCount++;
        try{
            // user=user.replace(/'/g,'"');
            // console.log(user, roomId);

            var parsedUser = user;

            function findUser(element) {
                if(element.userInfo.mid === parsedUser.mid){
                    return true;
                }
            }
            player[player.findIndex(findUser)].score += leftCard * (-1);

            ref.update({
                player,
                finishCount  
            }, (error) => {
                if (error) {
                    console.log("Data could not be saved." + error);
                    //alert
                    //return
                } else {
                    console.log("Data updated successfully.");
                }
            });
            if(capacity <= finishCount){
                ingame.to(roomId).emit('result', {player});  
                ref.remove();
            }
        } catch (error) {
            console.log("error : "+ error);
        }
      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
}