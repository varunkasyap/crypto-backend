const express = require('express');
const Crypto = require('../models/Crypto');

const router = express.Router();

router.get('/stats', async (req, res) => {
    const { coin } = req.query;
    const data = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(1);

    if (data.length === 0) return res.status(404).send('No data found');

    res.json({
        price: data[0].price,
        marketCap: data[0].marketCap,
        change24h: data[0].change24h,
    });
});

router.get('/deviation', async (req, res) => {
    const { coin } = req.query;
    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (records.length === 0) return res.status(404).send('No data found');

    const prices = records.map(record => record.price);
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
    const deviation = Math.sqrt(variance);

    res.json({ deviation: deviation.toFixed(2) });
});

module.exports = router;
