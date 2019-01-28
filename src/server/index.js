
// const WebSocket = require('ws');
const axios = require('axios');
//const ethereumjs = require('ethereumjs-util');
const web3 = require('web3-utils');
const { mapValues } = require('lodash');
var BigNumber = require('bignumber.js');
BigNumber.config({ EXPONENTIAL_AT : 1e+9 })
var axiosdebug = require('axios-debug-log')({
    request: function (debug, config) {
        console.log('Request with ' + JSON.stringify(config))
    },
    response: function (debug, response) {
        console.log(
        'Response with ' + JSON.stringify(response),
        'from ' + response.config.url
      )
    },
    error: function (debug, error) {
      // Read https://www.npmjs.com/package/axios#handling-errors for more info
      console.log('Boom', JSON.stringify(error))
    }
  })



const backend = {
    localAPI: async function (action, json = {}) {
        const API_URL = 'http://localhost:5000';
         const userAgent = 'Mozilla/4.0 (compatible; Node IDEX API)';
        const contentType = 'application/json';

            let headers = {
                'Content-type' : contentType,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'User-Agent': userAgent
            };

            try {
                const response = await axios.request({
                    url: action,
                    headers: headers,
                    method: 'POST',
                    baseURL: API_URL,
                    response: 'json',
                    data: json
                });

            
                console.log("response: ",  response);

                if ( response && response.status !== 200 ) return new Error(JSON.stringify(response.data));
                return JSON.stringify(response.data)
            } catch (error) {
                console.log(error.response.data)
                return new Error(JSON.stringify(error.response));
            }
    },
    /**
     * Adds two numbers.
     * @param {orderHash} orderHash The first number to add.
     * @param {nonce} nonce The second number to add.
     */
    cancelAPI: async function cancelAPI(token) {

        const obj = {
            token: token,
            };

        return await this.localAPI(`cancel`, obj)
    },
        /**
     * Adds two numbers.
     * @param {orderHash} orderHash The first number to add.
     * @param {nonce} nonce The second number to add.
     */
    orderAPI: async function cancelAPI(action = "sell", token, price, quantity) {
        console.log("action => ", action)
        console.log("token => ", token)
        console.log("price => ", price)
        console.log("quantity => ", quantity)

        const obj = {
            action: action,
            token: token,
            price: price,
            quantity: quantity,
            };

        return await this.localAPI(`order`, obj)
    },
    api: async function (action, json = {}) {
        const API_URL = 'https://api.idex.market/';
        const userAgent = 'Mozilla/4.0 (compatible; Node IDEX API)';
            const contentType = 'application/json';
            let headers = {
                 'User-Agent': userAgent,
                'Content-type': contentType,
                'Accept': contentType
            };
    
            try {
                const response = await axios.request({
                    url: action,
                    headers: headers,
                    method: 'POST',
                    baseURL: API_URL,
                    response: 'json',
                    data: json
                });
                
                if ( response && response.status !== 200 ) return new Error(JSON.stringify(response.data));
                return JSON.stringify(response.data)
            } catch (error) {
                console.log(error.response.data)
                return new Error(JSON.stringify(error.response));
            }
    },
    toWei:  function toWei(eth, decimals) { return new  BigNumber(String(eth)).times(new BigNumber(10 ** decimals)).floor().toString()},
    toEth:  function toEth(wei, decimals) { return new BigNumber(String(wei)).div(new BigNumber(10 ** decimals))},
    returnCurrency: async function returnCurrency(currency){
        let currencies = await this.api(`returnCurrencies`)
        let res =  currencies[currency];
        return res;
    },
    returnSignature: async function returnSignature(msgToSignIn,privateKeyIn){
        const privateKey = privateKeyIn.substring(0, 2) === '0x' ?
        privateKeyIn.substring(2, privateKeyIn.length) : privateKeyIn;
        const salted = ethereumjs.hashPersonalMessage(ethereumjs.toBuffer(msgToSignIn))
        const sig = mapValues(ethereumjs.ecsign(salted, new Buffer(privateKey, 'hex')), (value, key) => key === 'v' ? value : ethereumjs.bufferToHex(value));
        return sig;
    },
    returnTicker: async function (ticker = "ETH_HOT") {
        const json = { market: `${ticker}` }
        return await this.api(`returnTicker`, json)
    },
    returnBalances: async function returnBalances(address) {
        return await this.api(`returnBalances`, { address } )
    },
    returnOpenOrders: async function returnOpenOrders(market, address = null) {
        console.log({ market, address })
        return await this.api(`returnOpenOrders`, { market, address })
    },
    returnCompleteBalances: async function returnCompleteBalances(address) {
        console.log({ address })

        return await this.api(`returnCompleteBalances`, { address })
    },
    /**
     * order
     * @param {action} num1 The first number to add.
     * @param {price} num2 The second number to add.
     * @return {quantity} The result of adding num1 and num2.
     * @return {token} The result of adding num1 and num2.
     */
    order: async function order(action, price, quantity,token, privateKey) {
        console.log("price => ",price, '\n')
        console.log("quantity => ",quantity, '\n')
        console.log("price * quantity => ",price * quantity, '\n')
        console.log("token => ",token, '\n')

        let res = await this.returnNextNonce(_wallet_address);
    
        let contractAddress = await this.returnContractAddress(_wallet_address);

        const amountBigNum = new BigNumber(String(quantity));

        const amountBaseBigNum = new BigNumber(String(quantity * price));

        const tokenBuy = action === 'buy' ? token.address : _eth_token
        const tokenSell = action === 'sell' ? token.address : _eth_token
        const amountBuy = action === 'buy' ?
        this.toWei(amountBigNum, token.decimals) :
        this.toWei(amountBaseBigNum, 18);
        const amountSell = action === 'sell' ?
        this.toWei(amountBigNum, token.decimals) :
        this.toWei(amountBaseBigNum, 18);

        //"amountBuy": "",//"156481944430762460",
        // "amountSell": "",//"20511560000000000000000",
        // price 0.00000762
        // quantity 20511.56
        // total 0.15648194

        const args = {
            "contractAddress": contractAddress,
            "tokenBuy": tokenBuy,
            "amountBuy": amountBuy,
            "tokenSell": tokenSell,
            "amountSell": amountSell,
            "expires": 100000,
            "nonce": res.nonce,
            "address": _wallet_address
            }

            const raw = web3.soliditySha3({
            t: 'address',
            v: args.contractAddress
            }, {
            t: 'address',
            v: args.tokenBuy
            }, {
            t: 'uint256',
            v: args.amountBuy
            }, {
            t: 'address',
            v: args.tokenSell
            }, {
            t: 'uint256',
            v: args.amountSell
            }, {
            t: 'uint256',
            v: args.expires
            }, {
            t: 'uint256',
            v: args.nonce
            }, {
            t: 'address',
            v: args.address
            });

        var sig = await this.returnSignature(raw, privateKey);

        const obj = {
            tokenBuy: args.tokenBuy,
            amountBuy: args.amountBuy,
            tokenSell: args.tokenSell,
            amountSell: args.amountSell,
            address: _wallet_address,
            nonce: res.nonce,
            expires: args.expires,
            v: sig.v,
            r: sig.r,
            s: sig.s
            };

        console.log("order => ", obj, '\n');
        return await this.api(`order`,obj)
    },
        /**
     * Adds two numbers.
     * @param {orderHash} orderHash The first number to add.
     * @param {nonce} nonce The second number to add.
     */
    cancel: async function cancel(orderHash, nonce, privateKey) {

        let raw = web3.soliditySha3({
            t: 'uint256',
            v: orderHash
            }, {
            t: 'uint256',
            v: nonce
            });

        var sig = await this.returnSignature(raw, privateKey);

        const obj = {
            orderHash: orderHash,
            nonce: nonce,
            address: _wallet_address,
            v: sig.v,
            r: sig.r,
            s: sig.s,
            };

        return await this.api(`cancel`, obj)
    },

}
  
export  default backend;
