const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

async function createAccount() { //if create successfully, return account info
    try {
        const key_pair = StellarSdk.Keypair.random(); //generate a pair of public and private keys
        const private_key = key_pair.secret();
        const public_key = key_pair.publicKey();
        const register_url = `https://friendbot.stellar.org?addr=${encodeURIComponent(public_key)}`;

        const response = await fetch(register_url);
        //const responseJSON = await response.json();
        //console.log("SUCCESS! You have a new account :)\n", responseJSON);
        console.log('SUCCESS!!!');
        console.log('public key: ' + public_key);
        console.log('private key: ' + private_key);

        const account = await server.loadAccount(public_key);
        account.balances.forEach((balance) => {
            console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
        });
    } catch (e) {
        console.error("ERROR!", e);
    }
}

function transactionHistory(account_publickey) {
    server.transactions()
    .forAccount(account_publickey)
    .call()
    .then(function (page) {
        console.log('Page 1: ');
        console.log(page.records);
        return page.next();
    })
    .then(function (page) {
        console.log('Page 2: ');
        console.log(page.records);
    })
    .catch(function (err) {
        console.log(err);
    });
}

function getBalance(account_publickey){
    server.loadAccount(account_publickey)
    .then(Account => {
        console.log('Balance: ' + Account.balances[0].balance);
        console.log('Type: ' + Account.balances[0].asset_type);
    
    })
}

createAccount();