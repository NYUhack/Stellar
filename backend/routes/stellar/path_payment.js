const express = require("express");
const router = express.Router();
const { db } = require("../../services/firestore.js");
const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

var source_account = "GCHTTFP2SPYMNWL5SRXMFSIER7RSMZBIW4I6IAAXECB6NGO536HFIGZS";
var sourceAsset = StellarSdk.Asset.native();
var sourceAmount = "20";
var destinationAsset = new StellarSdk.Asset(
  "USD",
  "GD4P3IFSX6AG23NO5D6X5SVE5DYT4HQ7LEVRI4NUDBC6V5I4K2SLTJXU"
);

router.get("/", (req, res) => {
  server
    .strictSendPaths(sourceAsset, sourceAmount, [destinationAsset])
    .call()
    .then(function(pathResult) {
      console.log(pathResult.records);
    })
    .catch(function(err) {
      console.log(err);
    });
});

module.exports = router;
