const express = require("express");
const router = express.Router();
const { db } = require("../../services/firestore.js");

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const auth = db.auth();
  auth
    .logInWithEmailAndPassword(email, password)
    .then(response => {
      //once the user is logged on then query for the users public key
      db.collection("Users")
        .get(email)
        .then(snapshot => {
          //query for the users public key and load to the network
          const public_key = snapshot.data().Stellar_Address;
          server
            .loadAccount(public_key)
            .catch(function(error) {
              //check just in case the account doesn't exist
              if (error instanceof StellarSdk.NotFoundError) {
                res.status(404).send(error); //error
                throw new Error("The destination account does not exist!");
              } else {
                res.send(404);
              }
            })
            .then(function(Account) {
              res.status(200).send(Account);
            });
        });
    })
    .catch(error => {
      //error if the login does not work
      res.send(error.message);
    });
});

module.exports = router;
