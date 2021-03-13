const { request } = require("express");
const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')
const Enum = require('../../utils/enums.js');
const jsonConverter = require('../../utils/jsonStringConverter.js');

module.exports = (req, socket, rooms) => {
    console.log(req);
    var request = jsonConverter(req);
    var responseJson = new Object();
    let ref = firebase.database.ref("Rooms");

    if (isEmpty(request.roomId) || isEmpty(request.userInfo)) {
        responseJson.code = Enum.GameResponseCode.WrongRequest;
        var jsonString = JSON.stringify(responseJson);
        socket.emit('userlist', jsonString);
        console.log("일부 데이터가 비어있음 (join)");
        return;
    }

    ref.orderByKey()
        .equalTo(request.roomId)
        .once("value",
            function (snapshot) {
                if (snapshot.numChildren() === 0) {
                    console.log("그런 방은 없습니다");
                    responseJson.code = Enum.GameResponseCode.WrongRoomId;
                    socket.emit('userlist', JSON.stringify(responseJson));
                    return;
                }

                var refData = new Object();

                snapshot.forEach(function (data) {
                    refData = data.val();
                    return true;
                });

                var newUserList = new Array();
                newUserList = refData.userList;
                var userListResponseToJson = new Object();

                if (newUserList.length == refData.capacity && refData.joined == refData.capacity) {
                    console.log("이미 방이 꽉 참");
                    userListResponseToJson.code = Enum.GameResponseCode.FullRoomCapacity;
                }
                else {
                    var exist = newUserList.some(x => x.mid == request.userInfo.mid); 

                    if (exist) {
                        console.log("이미 방에 들어와있음");
                        userListResponseToJson.code = Enum.GameResponseCode.AlreadyJoined;
                    }
                    else {
                        socket.join(request.roomId);

                        userListResponseToJson.code = Enum.GameResponseCode.Success;
                        newUserList.push(request.userInfo);
                        var userListRef = ref.child(request.roomId);
                        userListRef.update({
                            "userList": newUserList,
                            "joined": newUserList.length
                        });
                    }
                    userListResponseToJson.userList = newUserList;
                    userListResponseToJson.host = refData.hostInfo;
                }
                
                console.log("유저 정보 전달(/join)");
                var successfulResponse = JSON.stringify(userListResponseToJson);
                console.log(successfulResponse);
                rooms.to(request.roomId).emit('userlist', JSON.stringify(userListResponseToJson));
            },
            function (error) {
                console.log(error);
                responseJson.code = Enum.GameResponseCode.ServerError;
                socket.emit('userlist', JSON.stringify(responseJson));
            });
}