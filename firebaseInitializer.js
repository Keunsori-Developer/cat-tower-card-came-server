let admin = require('firebase-admin');

// Fetch the service account key JSON file contents
let serviceAccount = require("./cat-tower-game-firebase-adminsdk-16ddd-0c2c4944b8.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cat-tower-game-default-rtdb.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
let database = admin.database();
let ref = database.ref("Rooms");


Attach an asynchronous callback to read the data at our posts reference
example code
ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  

exports.database = database;