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
                res.json(JSON.stringify(jsonArray));
            },
            function (error) {
                console.log("The read failed: " + error.code);
                res.status(500);
                res.json(null);
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
        json.hostId = data.val().hostId;

        jsonArray.push(json);
    });

    return jsonArray;
}