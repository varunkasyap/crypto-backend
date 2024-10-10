const axios = require('axios');
const Crypto = require('../models/Crypto');
const cron = require('node-cron');

const fetchCryptoData = async () => {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    const url = 'https://api.coingecko.com/api/v3/simple/price';

    try {
        const response = await axios.get(url, {
            params: {
                ids: coins.join(','),
                vs_currencies: 'usd',
                include_market_cap: 'true',
                include_24hr_change: 'true',
            },
        });

        const data = response.data;
        for (const coin of coins) {
            const cryptoData = new Crypto({
                coin: coin,
                price: data[coin].usd,
                marketCap: data[coin].usd_market_cap,
                change24h: data[coin].usd_24h_change,
            });
            await cryptoData.save();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

cron.schedule('0 */2 * * *', fetchCryptoData);//2hrs shedule

module.exports = fetchCryptoData;
