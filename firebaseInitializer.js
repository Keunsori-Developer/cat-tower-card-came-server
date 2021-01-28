const dotenv = require('dotenv');
dotenv.config();


let firebase = require('firebase/app');
require("firebase/database");

let firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
exports.database = database;