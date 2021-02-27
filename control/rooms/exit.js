const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')
const Enum = require('../../utils/enums.js');
const ConvertCsharpJson = require("../../utils/jsonStringConverter.js");

module.exports = (isDisconnected, req, savedData, socket, rooms) => {
    let ref = firebase.database.ref("Rooms");
    var reqRoomId, reqUserInfo;
    if (isDisconnected) {
        reqRoomId = savedData.roomId;
        reqUserInfo = savedData.userInfo;
    }
    else {
        var request = ConvertCsharpJson(req);
        reqRoomId = request.roomId;
        reqUserInfo = request.userInfo;
    }

    ref.orderByKey()
        .equalTo(reqRoomId)
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

            if (!ThisUserJoined(refData.userList, reqUserInfo)) {
                console.log("그런 유저는 없습니다");
                // res.status(200);
                // responseJson.code = Enum.GameResponseCode.WrongRequest;
                // res.send(JSON.stringify(responseJson));
                return;
            }

            var responseJson = new Object();
            var result = RemoveUserDataInRoom(ref.child(reqRoomId), refData, reqUserInfo);
            responseJson.code = Enum.GameResponseCode.Success;
            responseJson.roomId = reqRoomId;
            if (result != null) {
                responseJson.userList = result.userList;
                responseJson.host = result.hostInfo;
            }
            console.log("/rooms/exit success");
            var successfulResponse = JSON.stringify(responseJson);
            console.log(successfulResponse);
            socket.leave(reqRoomId);
            rooms.to(reqRoomId).emit('userlist', successfulResponse);
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
        return null;
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

    var returnValue = new Object();
    returnValue.hostInfo = hostData;
    returnValue.userList = newUserList;

    return returnValue;
}