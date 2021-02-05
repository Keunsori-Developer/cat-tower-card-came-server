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

                //TODO: 유저 정보 추가하고 나서 리턴해주기

                snapshot.forEach(function (data) {
                    res.status(200);
                    console.log(data.val().userList);
                    res.send(data.val().userList);
                    return true;
                })

            },
            function (error) {
                res.status(500);

            });
}