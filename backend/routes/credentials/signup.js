const express = require("express");
const router = express.Router();
const { db } = require("../../services/firestore.js");

router.get("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.passowrd;

  const auth = db.auth();
  auth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log(res);
      //Create a stellar account for the user
      //once the stellar account is made send 200 back to the user
      //if error send error back to the user

      //TODO: create a document to the database to save the users email and token adresss
    })
    .catch(error => {
      res.send(error.message);
    });
});

module.exports = router;
