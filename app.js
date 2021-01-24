const dotenv = require('dotenv');
const firebase = require('./firebaseInitializer');
dotenv.config();
const webSocket = require('./socket');



webSocket();//webSocket ingame