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
            });
}