const firebase = require("../../firebaseInitializer.js");
const randomKey = require('../../utils/randomKey.js');
const isEmpty = require('../../utils/checkEmpty.js')

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    console.log(req.body);
    var requestBody = req.body;
    console.log(requestBody.hostInfo);
    console.log(requestBody.name);
    console.log(requestBody.capacity);
    console.log(requestBody.mode);

    if (isEmpty(requestBody.hostInfo)
        || isEmpty(requestBody.name)
        || isEmpty(requestBody.capacity)
        || isEmpty(requestBody.mode)) {
        res.status(400);
        res.send(null);
        console.log("request error");

    }
    else {
        var new_roomId = randomKey(5);

        ref.child(new_roomId).set({
            hostInfo: requestBody.hostInfo,
            name: requestBody.name,
            capacity: requestBody.capacity,
            mode: requestBody.mode,
            status: "active",
            joined: 0
        }, function (error) {
            if (error) {
                res.status(500);
                res.send(null);
            } else {
                var json = new Object();
                json.roomId = new_roomId;
                res.status(200);
                res.send(JSON.stringify(json));
                console.log(JSON.stringify(json));
            }
        });

    }
}