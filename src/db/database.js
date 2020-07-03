const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://admin:passwordpassword@app-sfm6r.mongodb.net/test?retryWrites=true&w=majority';

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