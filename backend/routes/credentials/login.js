const express = require("express");
const router = express.Router();
const { db } = require("../../services/firestore.js");

router.get("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.passowrd;

  const auth = db.auth();
  auth
    .logInWithEmailAndPassword(email, password)
    .then(res => {
      console.log(res);
      //check for the users stellar account here
      //if user has a stellar acount send a status of 200 back to the client
    })
    .catch(error => {
      res.send(error.message);
    });
});

module.exports = router;
