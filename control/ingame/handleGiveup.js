const SocketIO = require('socket.io');
const path = require('path');
const firebase = require('../../firebaseInitializer.js');
const rebootIngame = require('../../utils/rebootIngame.js');

module.exports = (data, ingame) => { 
    console.log(data);
    data = data.replace(/'/g,'"');
    data = JSON.parse(data);

    let {user, roomId, leftCard} = data;

    let ref = firebase.database.ref(`Ingame/${roomId}`);
    ref.once("value", (snapshot) => {
        console.log(snapshot.val());
        
        let {order, capacity, board, player, mode, round} = snapshot.val();
        order++;
        order = order % capacity;

        try{
            let count = 0;
            while(player[order].giveup === true&&count<7){
                order++;
                count++;
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

            function checkRoundEnd() {
                for(let i in player){
                    if(player[i].giveup === false) return false;
                }
                return true;
            }

            player[player.findIndex(findUser)].score += leftCard * (-1);

            ref.update({
                player,
                order 
            }, (error) => {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    console.log("Data updated successfully.");
                    if(checkRoundEnd()){
                        if(mode * 2 === round){
                            ingame.to(roomId).emit('result', JSON.stringify({player}));  
                            console.log("result");
                            ref.remove();
                        } else {
                            ingame.to(roomId).emit('endround', JSON.stringify({ user : parsedUser , player, board, order, giveup : true}));
                            console.log("endround");
                            rebootIngame(roomId);        
                        }               
                    } else {
                        console.log("status");
                        ingame.to(roomId).emit('status', JSON.stringify({ user : parsedUser , player, board, order, giveup : true}));
                    }
                }
            });                
        }catch (error) {
            console.log("parsing error : "+ error);
        }

      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
}