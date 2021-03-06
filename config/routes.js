'use strict';

const controllers = require('../controllers');
const middlewares = require('../middlewares');

module.exports = app => {

    // executed every time `:address` is found in the path; before any controller
    app.param('address', middlewares.walletFilter.retrieveWalletByAddress);

    // Wallet Endpoints
    app.get("/wallets/:address", controllers.walletResource.retrieveWalletByAddress);
    app.get("/wallets/:address/balance", controllers.walletResource.retrieveWalletBalance);

    // Transaction Endpoints
    app.post('/wallets/:address/transactions/send', [
        controllers.transactionResource.validateTransactionData,
        controllers.transactionResource.submitTransaction
    ]);
    app.post('/wallets/:address/transactions', [
        controllers.transactionResource.validateTransactionData,
        controllers.transactionResource.createTransaction
    ]);


    app.post("/wallets", controllers.walletResource.createWallet);
    app.put("/wallets", controllers.walletResource.loadWallet);

    app.use(controllers.errorHandler.handle);

    app.all('*', (req, res) => {

        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};
