const { request } = require("express");
const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')
const Enum = require('../../utils/enums.js');

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    var requestBody = req.body;
    console.log(requestBody);

    if (isEmpty(requestBody.roomId) || isEmpty(requestBody.userInfo)) {
        res.status(200);
        var responseJson = new Object();
        responseJson.code = Enum.GameResponseCode.WrongRequest;
        res.send(JSON.stringify(responseJson));
        return;
    }

    ref.orderByKey()
        .equalTo(requestBody.roomId)
        .once("value",
            function (snapshot) {
                if (snapshot.numChildren() === 0) {
                    var responseJson = new Object();
                    responseJson.code = Enum.GameResponseCode.WrongRoomId;
                    res.send(JSON.stringify(responseJson));
                    res.status(200);
                    console.log("그런 방은 없습니다");
                    return;
                }

                var refData = new Object();

                snapshot.forEach(function (data) {
                    refData = data.val();
                    return true;
                });

                var newUserList = new Array();
                newUserList = refData.userList;
               // var newUserList = refData.userList;
                var userListResponseToJson = new Object();

                if (newUserList.length == refData.capacity && refData.joined == refData.capacity) {
                    console.log("이미 방이 꽉 참");
                    userListResponseToJson.code = Enum.GameResponseCode.FullRoomCapacity;
                }
                else {
                    var exist = newUserList.some(x => x.mid == requestBody.userInfo.mid); 

                    if (exist) {
                        console.log("이미 방에 들어와있음");
                        userListResponseToJson.code = Enum.GameResponseCode.AlreadyJoined;
                    }
                    else {
                        userListResponseToJson.code = Enum.GameResponseCode.Success;
                        newUserList.push(requestBody.userInfo);
                        var userListRef = ref.child(requestBody.roomId);
                        userListRef.update({
                            "userList": newUserList,
                            "joined": newUserList.length
                        });
                    }
                    userListResponseToJson.userList = newUserList;
                }

                console.log("유저 정보 전달(/join)");
                console.log(newUserList);

                res.status(200);
                res.send(JSON.stringify(userListResponseToJson));
                return true;
            },
            function (error) {
                res.status(500);
                res.send(null);
            });
}