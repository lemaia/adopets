require('./models/User');
require('./models/Product');
require('./models/ActionLog');
require('./models/BlacklistToken');
require('dotenv').config()

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