const firebase = require("../../firebaseInitializer.js");
const isEmpty = require('../../utils/checkEmpty.js')

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    var requestBody = req.body;
    console.log(requestBody);

    if (isEmpty(requestBody.roomId)) {
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

                snapshot.forEach(function (data) {
                    var userList = data.val().userList;
                    res.status(200);
                    console.log("유저 정보 전달(/userlist)");
                    var json = new Object();
                    json.userInfo = userList;
                    res.send(JSON.stringify(json));
                    return true;
                })
            },
            function (error) {
                res.status(500);
                console.log(error);
            });
}