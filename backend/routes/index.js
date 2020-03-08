var express = require("express");
var router = express.Router();
var StellarSdk = require("stellar-sdk");
const account1 = "GCHTTFP2SPYMNWL5SRXMFSIER7RSMZBIW4I6IAAXECB6NGO536HFIGZS";
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Express" });
});

module.exports = router;
