'use strict'

const Transaction = require('./Transaction');
const TransactionHash = require('./TransactionHash');

const request = require('request');

module.exports = {

    createTransaction(request, response, next) {
        try {
            let transaction = Transaction.createTransaction(request);

            response.status(200);
            response.set('Content-Type', 'application/json');
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.send(transaction);
        } catch (err) {
            console.error(err);
            next(new Error("Transaction creation failed."));
        }
    },

    validateTransactionData(request, response, next) {
        try {
            let from = request.body["from"];
            if (!from || from.length != 40 || from != request.wallet.address) {
                throw new Error("Invalid sender address.");
            }

            let senderPublicKey = request.body["senderPubKey"];
            if (!senderPublicKey || senderPublicKey.length != 65) {
                throw new Error("Invalid sender public key.");
            }

            let recipientAddress = request.body['to'];
            if (!recipientAddress || recipientAddress.length != 40) {
                throw new Error("Invalid recipient address.");
            }

            let amount = request.body['value'];
            if (!amount || amount <= 0) {
                throw new Error("Invalid transaction amount.");
            }

            let fee = request.body['fee'];
            if (!fee || fee <= 0) {
                throw new Error("Invalid transaction fee.");
            }
        } catch (err) {
            next(err);
            return;
        }
        next();
    },

    submitTransaction: async (rqst, rspns, next) => {
        let transaction = Transaction.createTransaction(rqst);
        let transactionHash = new TransactionHash(transaction);
        let options = {
            method: 'post',
            body: transaction,
            json: true,
            // TODO: move to a configuration
            url: "http://127.0.0.1:5555/transactions",
        };

        await request(options, function (err, res, transactionHashBody) {
            if (err) {
                next(new Error("Error: " + err.getMessage()));
                return;
            }
            if (!transactionHashBody || !transactionHashBody.transactionHash
                || transactionHash.transactionHash !== transactionHashBody.transactionHash) {
                next(new Error("Compromised transaction."));
                return;
            }

            rspns.status(201);
            rspns.set('Content-Type', 'application/json');
            rspns.header("Access-Control-Allow-Origin", "*");
            rspns.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            rspns.send(transactionHashBody);
        });
    }
};
