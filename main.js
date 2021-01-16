var http = require('http');
var url = require('url');

const room1 = require('./Rooms/create.js');


http.createServer(room1.createRoom).listen(8080);