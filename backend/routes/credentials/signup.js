const express = require("express");
const router = express.Router();
const { db } = require("../../services/firestore.js");
const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

async function createAccount() {
  //if create successfully, return account info
  try {
    const key_pair = StellarSdk.Keypair.random(); //generate a pair of public and private keys
    const private_key = key_pair.secret();
    const public_key = key_pair.publicKey();
    const register_url = `https://friendbot.stellar.org?addr=${encodeURIComponent(
      public_key
    )}`;

    const response = await fetch(register_url);
    //const responseJSON = await response.json();
    //console.log("SUCCESS! You have a new account :)\n", responseJSON);
    console.log("SUCCESS!!!");
    console.log("public key: " + public_key);
    console.log("private key: " + private_key);

    const account = await server.loadAccount(public_key);
    account.balances.forEach(balance => {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
    return [public_key, private_key];
  } catch (e) {
    console.error("ERROR!", e);
  }
}

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.passowrd;

  const auth = db.auth();
  auth
    .signInWithEmailAndPassword(email, password)
    .then(response => {
      const keys = createAccount(); //returns an array. [public_key, private_key]
      //store keys into database with email, username, password
      db.collection("Users")
        .doc(email)
        .set({
          email: email,
          public_key: keys[0],
          privat_key: keys[1]
        })
        .then(() => {
          res.status(200).send(email);
          console.log("the users data was saved");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    })
    .catch(error => {
      res.send(error.message);
    });
});

module.exports = router;
