let firebase = require("firebase-admin");
let serviceAccount = require("../stellar-nyu-firebase-adminsdk-5dr9z-4ab149d8f2.json");

//init the firebase connection to backend
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://stellar-nyu.firebaseio.com"
});

const db = firebase;

module.exports = {
  db
};
