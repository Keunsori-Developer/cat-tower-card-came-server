const firebase = require("../../firebaseInitializer.js");
const Enum = require("../../utils/enums.js");

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    ref.orderByChild("status")
        .equalTo("active")
        .once("value",
            function (snapshot) {
                var jsonArray = convertToJson(snapshot);

                var roomsToJson = new Object();
                roomsToJson.code = Enum.GameResponseCode.Success;
                roomsToJson.rooms = jsonArray;
                res.status(200);
                res.send(JSON.stringify(roomsToJson));
                console.log("/rooms/active success");
                console.log(JSON.stringify(roomsToJson));
            },
            function (error) {
                console.log("The read failed: " + error.code);
                res.status(500);
                res.send(null);
            });
}

function convertToJson(snapshot) {
    console.log(snapshot.val());

    var jsonArray = new Array();


    snapshot.forEach(function (data) {
        var json = new Object();
        json.id = data.key;
        json.name = data.val().name;
        json.joined = data.val().joined;
        json.capacity = data.val().capacity;

        var hostInfo = new Object();
        hostInfo.nickname = data.val().hostInfo.nickname;
        hostInfo.mid = data.val().hostInfo.mid;
        json.hostInfo = hostInfo;

        jsonArray.push(json);
    });

    return jsonArray;
}