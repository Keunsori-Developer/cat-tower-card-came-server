const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')
const Enum = require('../../utils/enums.js');

module.exports = (req) => {
    let ref = firebase.database.ref("Rooms");

    var requestBody = JSON.parse(req);
    //var responseJson = new Object();

    if (isEmpty(requestBody.roomId) || isEmpty(requestBody.userInfo)) {
        // res.status(200);
        // responseJson.code = Enum.GameResponseCode.WrongRequest;
        // res.send(JSON.stringify(responseJson));
        return;
    }

    ref.orderByKey()
        .equalTo(requestBody.roomId)
        .once("value", function (snapshot) {
            if (snapshot.numChildren() === 0) {
                // responseJson.code = Enum.GameResponseCode.WrongRoomId;
                // res.send(JSON.stringify(responseJson));
                // res.status(200);
                console.log("그런 방은 없습니다");
                return;
            }

            var refData = new Object();

            snapshot.forEach(function (data) {
                refData = data.val();
                return true;
            });

            if (!ThisUserJoined(refData.userList, requestBody.userInfo)) {
                console.log("그런 유저는 없습니다");
                // res.status(200);
                // responseJson.code = Enum.GameResponseCode.WrongRequest;
                // res.send(JSON.stringify(responseJson));
                return;
            }

            RemoveUserDataInRoom(ref.child(requestBody.roomId), refData, requestBody.userInfo);
            // responseJson.code = Enum.GameResponseCode.Success;
            // res.status(200);
            // res.send(JSON.stringify(responseJson));
            console.log("/rooms/exit success");
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            // res.status(500);
            // res.send(null);
        })
}

function ThisUserJoined(userList, requestedUser) {
    var userListArray = new Array();
    userListArray = userList;
    return userListArray.some(x => x.mid === requestedUser.mid);
}

function RemoveUserDataInRoom(roomDataRef, refData, requestedUser) {
    var oldUserList = new Array();
    oldUserList = refData.userList;

    var cntUserLength = refData.joined;
    if (refData.joined === 1 || oldUserList.length === 1) {
        ref.child(requestBody.roomId).set(null);
        console.log("방이 삭제됩니다");
        return;
    }
    var newUserList = new Array();
    newUserList = oldUserList.filter(x => x.mid != requestedUser.mid);

    var hostData = refData.hostInfo;
    if (hostData.mid === requestedUser.mid) {
        console.log("방장 교체");
        hostData = newUserList[0];
    }

    roomDataRef.update({
        "hostInfo": hostData,
        "userList": newUserList,
        "joined": newUserList.length
    });
}