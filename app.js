const dotenv = require('dotenv');
const firebase = require('./firebaseInitializer');
dotenv.config();
const webSocket = require('./socket');
const http = require('./http');



webSocket();//webSocket ingame
http();