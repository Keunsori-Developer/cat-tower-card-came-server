const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js');
const Enum = require('../../utils/enums.js');

// module.exports = (req, res) => {
//     let ref = firebase.database.ref("Rooms");

//     var requestBody = req.body;
//     console.log(requestBody);

//     if (isEmpty(requestBody.roomId)) {
//         res.status(200);
//         var responseJson = new Object();
//         responseJson.code = Enum.GameResponseCode.WrongRequest;
//         res.send(JSON.stringify(responseJson));
//         return;
//     }

//     ref.orderByKey()
//         .equalTo(requestBody.roomId)
//         .once("value",
//             function (snapshot) {
//                 console.log(snapshot.numChildren());
//                 if (snapshot.numChildren() === 0) {
//                     res.status(200);
//                     var responseJson = new Object();
//                     responseJson.code = Enum.GameResponseCode.WrongRoomId;
//                     console.log("그런 방은 없습니다");
//                     return;
//                 }

//                 snapshot.forEach(function (data) {
//                     var userList = data.val().userList;
//                     res.status(200);
//                     console.log("유저 정보 전달(/userlist)");
//                     var json = new Object();
//                     json.code = Enum.GameResponseCode.Success;
//                     json.userInfo = userList;
//                     json.host = data.val().hostInfo;
//                     res.send(JSON.stringify(json));
//                     return true;
//                 })
//             },
//             function (error) {
//                 res.status(500);
//                 console.log(error);
//             });
// }

module.exports = (roomId, namespace) => {
    let ref = firebase.database.ref("Rooms");


    if (isEmpty(roomId)) {
        return null;
    }

    ref.orderByKey()
        .equalTo(roomId)
        .once("value",
            function (snapshot) {
                console.log(snapshot.numChildren());
                if (snapshot.numChildren() === 0) {
                    var responseJson = new Object();
                    responseJson.code = Enum.GameResponseCode.WrongRoomId;
                    console.log("그런 방은 없습니다");
                    return JSON.stringify(responseJson);
                }

                snapshot.forEach(function (data) {
                    var userList = data.val().userList;
                    console.log("유저 정보 전달(/userlist)");
                    var json = new Object();
                    json.code = Enum.GameResponseCode.Success;
                    json.roomId = roomId;
                    json.roomName = data.val().name;
                    json.userInfo = userList;
                    json.host = data.val().hostInfo;
                    console.log(JSON.stringify(json));
                    console.log(typeof JSON.stringify(json))
                    return JSON.stringify(json);
                })
            },
            function (error) {
                console.log(error);
                return null;
            });
}