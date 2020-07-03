require('dotenv').config()


const fs = require('fs');
const path = require('path');

const modelsPath = path.resolve(__dirname, 'models')
fs.readdirSync(modelsPath).forEach(file => {
    require(modelsPath + '/' + file);
})

const express = require('express');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const requireAuth = require('./middlewares/requireAuth');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.json());
app.use(userRoutes);
app.use(productRoutes);

app.listen(3000, () => {
    console.log('Listening on 3000');
});