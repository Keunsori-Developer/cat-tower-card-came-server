const dotenv = require('dotenv');
const firebase = require('./firebaseInitializer');
dotenv.config();
const ingame = require('./ingame');
const http = require('./http');



ingame(); //webSocket ingame
http();