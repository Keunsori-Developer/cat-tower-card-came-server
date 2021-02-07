const firebase = require("../../firebaseInitializer.js");

module.exports = (req, res) => {
    let ref = firebase.database.ref("Rooms");

    ref.orderByChild("status")
        .equalTo("active")
        .once("value",
            function (snapshot) {
                var jsonArray = convertToJson(snapshot);
                console.log("!!!");
                console.log(jsonArray);
                res.status(200);
                res.send(JSON.stringify(jsonArray));
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
        console.log(data.key);
        console.log(data.val());

        var json = new Object();
        json.id = data.key;
        json.name = data.val().name;
        json.joined = data.val().joined;
        json.capacity = data.val().capacity;

        var hostInfo = new Object();
        hostInfo.nickname = data.val().nickname;
        hostInfo.mid = data.val().mid;
        json.hostInfo = hostInfo;

        jsonArray.push(json);
    });

    return jsonArray;
}