# Wallet App

The `Wallet App` is an application which:
* [Creates a new wallet (generating private and public key on behalf of the user)](#create-wallet)
* [Loads an existing wallet (by data + password)](#load-existing-wallet)
* [Creates, signs](#create-transaction) and sends transactions 
* Provides access to balance

# Launching

In order to launch the `Wallet App` server you would need to execute the following command in the command line:
```
npm start
```

Environment could be specified when launching the server as well:
```
NODE_ENV=<ENVIRONMENT_NAME> npm start 
```
where `<ENVIRONMENT_NAME>` should be the value of the corresponding environment on which the server would be ran, e.g. `development`.

# API

## Create Wallet


### Example 

#### Request
```
POST /wallets
```

#### Response

The payload would be look in the following way:
```
201 - successful call
{
    "privateKey": "d4533c6141d72c7ad542ea64d25f8ed820195adc09537fc74dacbb283354c64f",
    "publicKey": "b51eccb98ce565474ef06d4145b96e4a397f929190c007dc703eeeb42ce71a701",
    "address": "a838fdabe6c9ddd8b01c4dfdb736d3d9e7240d0d"
}
```

## Load Existing Wallet

### Example 

#### Request
```
PUT /wallets
{
  "privateKey": "7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34"
}
```

#### Response
On successful call the status would be either: 
* `201`, i.e. a new wallet was created on the server or 
* `200`, i.e. the resource does already exist.

The payload would be look in the following way:
```
{
    "privateKey": "7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34",
    "publicKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
    "address": "c3293572dbe6ebc60de4a20ed0e21446cae66b17"
}
```

## Retrieve Wallet Info

Please note that this endpoint is NOT available on production environment.

### Example 

#### Request
```
GET /wallets/c3293572dbe6ebc60de4a20ed0e21446cae66b17
```

#### Response
```
200 - successful call
{
    "privateKey": "7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34",
    "publicKey": [
        "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba",
        "a54aa7835a34e10dc6c8e386dc32e98bb18583f7c7259be3e444fe2876b9aaef"
    ],
    "compressedPublicKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
    "address": "c3293572dbe6ebc60de4a20ed0e21446cae66b17"
}
```

## Create Transaction

### Example 

#### Request

```
POST /wallets/:address/transactions
{
  "from": "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
  "to": "f51362b7351ef62253a227a77751ad9b2302f911",
  "senderPubKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
  "value": 25000, 
  "fee": 10
}
```
At the moment `:address` should have the value of the `from` field.

#### Response
```
200 - successful call
{
    "from": "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
    "to": "f51362b7351ef62253a227a77751ad9b2302f911",
    "senderPubKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
    "value": 25000,
    "fee": 10,
    "dateCreated": "2018-02-10T17:53:48.972Z",
    "senderSignature": [
        "1aaf55dcb11060749b391d547f37b4727222dcb90e793d9bdb945c64fe4968b0",
        "87250a2841f7a56910b0f7ebdd067589632ccf19d352c15f16cfdba9b7687960"
    ]
}
```
# Future Work
* The `Wallet App` might be based on the HD wallet standards (BIP-39 / BIP-32)
