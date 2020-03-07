const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');
const fs = require('fs');

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
const key_pair = StellarSdk.Keypair.random(); //generate a pair of public and private keys
const private_key = key_pair.secret();
const public_key = key_pair.publicKey();
const register_url = `https://friendbot.stellar.org?addr=${encodeURIComponent(public_key)}`;

//write to file
var test_json = {}
test_json['user1'] = {
    'private': private_key,
    'public': public_key
}

fs.writeFile('test.json', JSON.stringify(test_json), err => {
    if (err)
        throw err;
});

async function createAccount() { //if create successfully, return account info
    try {
        const response = await fetch(register_url);
        //const responseJSON = await response.json();
        //console.log("SUCCESS! You have a new account :)\n", responseJSON);
        console.log('SUCCESS!!!');
        const account = await server.loadAccount(public_key);
        console.log("Balances for account: " + public_key);
        account.balances.forEach((balance) => {
            console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
        });
    } catch (e) {
        console.error("ERROR!", e);
    }
}

createAccount();

