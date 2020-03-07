const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
var sourceKeys = StellarSdk.Keypair
    .fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
var destinationId = 'GCKJLWT4LKUN7KYWETEU6DLZCPDECSAHGBJMB2PLUV7BVSSTKKUYSYYH'; //pay target
// Transaction will hold a built transaction we can resubmit if the result is unknown.
var transaction;

//check target account exists
function pay(amount, from, to){ //String amount
    server.loadAccount(to)
    .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
            throw new Error('The destination account does not exist!');
        } else return error
    })
    .then(function () {
        return server.loadAccount(from.publicKey()); //if pay target exists, load payer account
    })
    .then(function (sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, { //pass in Account object
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: to,
                //type of asset: lumens, dollars, euros
                asset: StellarSdk.Asset.native(), //native asset is lumen
                amount: amount
            }))
            .addMemo(StellarSdk.Memo.text('meta'))
            // Wait a maximum of three minutes for the transaction
            .setTimeout(180)
            .build();
        transaction.sign(from); //prove you're valid using source key
        return server.submitTransaction(transaction); //submit
    })
    .then(function (result) {
        console.log('Success! Results:', result);
    })
    .catch(function (error) {
        console.error('Something went wrong!', error);
    });
}

pay('100',sourceKeys, destinationId);