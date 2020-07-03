const mongoose = require('mongoose');

const mongoURI = process.env.DB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
});
mongoose.connection.on('error', (err) => {
    console.error('Error on Mongo', err);
});

module.exports = { mongoose };