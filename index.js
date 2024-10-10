const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fetchCryptoData = require('./cron/fetchCryptoData');
const cryptoRoutes = require('./routes/cryptoRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


app.use('', cryptoRoutes);

fetchCryptoData();//cron job

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
