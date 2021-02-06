const { json } = require("express");
const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    var requestBody = req.body;
    console.log(requestBody);

    if (isEmpty(requestBody.roomId) || isEmpty(requestBody.userInfo)) {
        res.status(400);
        res.send(null);
        return;
    }

    ref.orderByKey()
        .equalTo(requestBody.roomId)
        .once("value",
            function (snapshot) {
                console.log(snapshot.numChildren());
                if (snapshot.numChildren() === 0) {
                    res.send(null);
                    res.status(500);
                    console.log("그런 방은 없습니다");
                    return;
                }

                var refData = new Object();

                snapshot.forEach(function (data) {
                    refData = data.val();
                    return true;
                })

                var newUserList = refData.userList;
                console.log(newUserList.length);
                console.log(refData.capacity);
                if (newUserList.length == refData.capacity) {
                    console.log("이미 방이 꽉 참");
                    res.status(202);
                }
                else {
                    res.status(200);
                    newUserList.push(requestBody.userInfo);
                    var userListRef = ref.child(requestBody.roomId);
                    userListRef.update({
                        "userList": newUserList
                    });
                }

                console.log("유저 정보 전달(/join)");
                console.log(newUserList);
                var userListToJson = new Object();
                userListToJson.userList = newUserList;
                res.send(JSON.stringify(userListToJson));
                return true;

            },
            function (error) {
                res.status(500);

            });
}