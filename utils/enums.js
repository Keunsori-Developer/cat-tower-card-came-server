var GameResponseCode = Object.freeze(
    {
        "Success": 20000,
        "WrongRequest": 40000,
        "WrongRoomId": 40101,
        "FullRoomCapacity": 40102,
        "AlreadyJoined": 40103
    }
);

/*
20000 : Success 성공
40000 : WrongRequest Request 에 문제가 있는 경우 (오타 혹은 잘못된 json 형식)
40101 : WrongRoomId 요청보낸 roomId에 해당하는 방 정보가 존재하지 않는 경우
40102 : FullRoomCapacity /rooms/join 호출했을 때 이미 방이 꽉 찬 경우
40103 : AlreadyJoined /rooms/join 호출했을 때 유저가 이미 방에 진입한 경우
*/

exports.GameResponseCode = GameResponseCode;