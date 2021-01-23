let firebase = require('firebase/app');
require("firebase/database");

let firebaseConfig = {
    apiKey: "AIzaSyBnF9EBYncAtO5QX79SkS6ceYoOR_10iYU",
    authDomain: "cat-tower-game.firebaseapp.com",
    databaseURL: "https://cat-tower-game-default-rtdb.firebaseio.com",
    projectId: "cat-tower-game",
    storageBucket: "cat-tower-game.appspot.com",
    messagingSenderId: "776896556502",
    appId: "1:776896556502:web:dd52d66efefd9a41d04877",
    measurementId: "G-087BLTHQ22"
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
exports.database = database;