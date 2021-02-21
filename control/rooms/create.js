const firebase = require("../../firebaseInitializer.js");
const randomKey = require('../../utils/randomKey.js');
const isEmpty = require('../../utils/checkEmpty.js');
const Enum = require('../../utils/enums.js');

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    console.log(req.body);
    var requestBody = req.body;

    if (isEmpty(requestBody.hostInfo)
        || isEmpty(requestBody.name)
        || isEmpty(requestBody.capacity)
        || isEmpty(requestBody.mode)) {
        res.status(200);
        var responseJson = new Object();
        responseJson.code = Enum.GameResponseCode.WrongRequest;
        res.send(JSON.stringify(responseJson));
        console.log("request error");
        return;
    }

    var new_roomId = randomKey(5);

    ref.child(new_roomId).set({
        hostInfo: requestBody.hostInfo,
        name: requestBody.name,
        capacity: requestBody.capacity,
        mode: requestBody.mode,
        userList: new Array(requestBody.hostInfo),
        status: "active",
        joined: 1
    }, function (error) {
        if (error) {
            res.status(500);
            res.send(null);
        } else {
            var json = new Object();
            json.code = Enum.GameResponseCode.Success;
            json.roomId = new_roomId;
            res.status(200);
            res.send(JSON.stringify(json));
            console.log(JSON.stringify(json));
        }
    });
}
