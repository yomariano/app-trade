
// const WebSocket = require('ws');
const axios = require('axios');
// const ethereumjs = require('ethereumjs-util');
// const ethereumunits = require('ethereumjs-units');
// const web3 = require('web3-utils');
// const { mapValues } = require('lodash');
const backend = {
    api: async function (action, json = {}) {
        const API_URL = 'https://api.idex.market/';
        const userAgent = 'Mozilla/4.0 (compatible; Node IDEX API)';
            const contentType = 'application/json';
            let headers = {
                 'User-Agent': userAgent,
                'Content-type': contentType
            };
    
            try {
                const response = await axios.request({
                    url: action,
                    headers: headers,
                    method: 'POST',
                    baseURL: API_URL,
                    data: json
                });
                console.log(JSON.stringify(response.data));

                if ( response && response.status !== 200 ) return new Error(JSON.stringify(response.data));
                return response.data;
            } catch (error) {
                console.log(error.response.data)
                return new Error(JSON.stringify(error.response));
            }
      },
      returnTicker: async function (ticker = "ETH_HOT") {
        const json = { market: `${ticker}` }
        return await this.api(`returnTicker`, json)
    }

}
  
export  default backend;
