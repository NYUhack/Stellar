const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
//const { db } = require("../../services/firestore.js");
app.use(express.static(path.join(__dirname, '../../public/Login')));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public') + '/login.html');
  /* const email = req.body.email;
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
    }); */
});
app.use(bodyParser.json());


router.post('/auth', function (request, response) {
  fs.writeFile('./test.txt', JSON.stringify(request), (e) => {
    console.log(e);
  });

});

module.exports = router;
