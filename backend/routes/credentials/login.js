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

      const public_key = 0
      const private_key = 0

      server.loadAccount(public_key)
        .catch(function (error) { //check just in case the account doesn't exist
          if (error instanceof StellarSdk.NotFoundError) {
            res.send(404); //error
            throw new Error('The destination account does not exist!');
          } else {
            res.send(404);
          }
        })
        .then(function (Account) {
          //We have the user's Account object. do something like check their history or balance.
        })

    })
    .catch(error => {
      res.send(error.message);
    });
});

module.exports = router;
