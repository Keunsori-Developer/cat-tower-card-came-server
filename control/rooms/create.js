const firebase = require("../../firebaseInitializer.js");
const randomKey = require('../../utils/randomKey.js');
const isEmpty = require('../../utils/checkEmpty.js');
const Enum = require('../../utils/enums.js');
const jsonConverter = require('../../utils/jsonStringConverter.js');
const userlist = require("./userlist.js");

module.exports = (req, socket) => {
    let ref = firebase.database.ref("Rooms");
    var requestData = jsonConverter(req);
    console.log(requestData);
    var responseJson = new Object();

    if (isEmpty(requestData.hostInfo)
        || isEmpty(requestData.name)
        || isEmpty(requestData.capacity)
        || isEmpty(requestData.mode)) {
        responseJson.code = Enum.GameResponseCode.WrongRequest;
        var response = JSON.stringify(responseJson);
        console.log("request error");
        socket.emit('userlist', response);
        return;
    }

    var new_roomId = randomKey(5);

    ref.child(new_roomId).set({
        hostInfo: requestData.hostInfo,
        name: requestData.name,
        capacity: requestData.capacity,
        mode: requestData.mode,
        userList: new Array(requestData.hostInfo),
        status: "active",
        joined: 1
    }, function (error) {
        if (error) {
            responseJson.code = Enum.GameResponseCode.ServerError;
            socket.emit('userlist', JSON.stringify(responseJson));
        } else {
            var json = new Object();
            var userArray = new Array();
            userArray.push(requestData.hostInfo);
            json.code = Enum.GameResponseCode.Success;
            json.roomId = new_roomId;
            json.userList = userArray;
            json.host = requestData.hostInfo;
            var successfulResponse = JSON.stringify(json);
            console.log(successfulResponse);
            // 이 유저가 방에 들어온 유일한 유저이기 때문에, 해당 클라에게만 이벤트를 전달해도 무방함
            socket.emit('userlist', successfulResponse);
            socket.join(request.roomId);
        }
    });
}
