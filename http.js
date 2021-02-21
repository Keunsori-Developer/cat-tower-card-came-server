module.exports = () => {
    const http = require('http');
    const url = require('url');
    const express = require('express');

    const app = express();
    app.use(express.json());

    const rooms = require("./routes/rooms.js");

    app.use('/rooms', rooms);
    app.listen(3000);

    console.log("start");
}