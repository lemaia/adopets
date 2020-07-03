const jwt = require('jsonwebtoken');
const { mongoose } = require('../db/database');
const User = mongoose.model('User');
const BlackListToken = mongoose.model('BlacklistToken');

module.exports = (req, res, next) => {

    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(401).send({ error: 'You must be logged in' });
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.SECRET, async (err, payload) => {
        if(err) {
            const blacklistToken = new BlackListToken({ token: token });
            await blacklistToken.save();
            return res.status(401).send({ error: 'You must be logged in' });
        }

    const blacklistToken = await BlackListToken.find({ token: token });
    if(blacklistToken.length > 0) {
        return res.status(401).send({ error: 'You must be logged in' });
    }

    const  { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
 });
};