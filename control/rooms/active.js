const { json } = require("express");
const firebase = require("../../firebaseInitializer.js");
const Enum = require("../../utils/enums.js");

module.exports = (socket) => {
    let ref = firebase.database.ref("Rooms");

    var roomsToJson = new Object();

    ref.orderByChild("status")
        .equalTo("active")
        .once("value",
            function (snapshot) {
                var jsonArray = convertToJson(snapshot);

                roomsToJson.code = Enum.GameResponseCode.Success;
                roomsToJson.rooms = jsonArray;
                var successfulResponse = JSON.stringify(roomsToJson);
                console.log("/rooms/active success");
                socket.emit('active', successfulResponse);
            },
            function (error) {
                console.log("The read failed: " + error.code);
                roomsToJson.code = Enum.GameResponseCode.ServerError;
                var response = JSON.stringify(roomsToJson);
                socket.emit('active', response);
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
        json.mode = data.val().mode;

        var hostInfo = new Object();
        hostInfo.nickname = data.val().hostInfo.nickname;
        hostInfo.mid = data.val().hostInfo.mid;
        json.hostInfo = hostInfo;

        jsonArray.push(json);
    });

    return jsonArray;
}