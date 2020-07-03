const express = require('express');
const { mongoose } = require('../db/database');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const BlackListToken = mongoose.model('BlacklistToken');

const log = require('simple-node-logger').createSimpleLogger({
    logFilePath: 'adoptes.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

const signup = async (data) => {
    try {
        const user = new User(data);
        await user.save();

        return user;
    } catch (err) {
        log.error('Failed to create an accont - error: ', err);
        throw new Error('Failed to create an account');
    }
};

const signout = async (token) => {
    try {
        const blacklistToken = new BlackListToken({ token: token});
        await blacklistToken.save();
    } catch (err) {
        log.error('Failed to logout - error: ', err);
    }
};

const generateToken = async (userId) => {
    try {
        const token = jwt.sign({ userId: userId }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRES });
        return token;
    } catch (err) {
        log.error('Failed to generate token - error: ', err);
        throw new Error('Failed to generate token');
    }
};


const isEmailInUse = async (email) => {
    const record = await User.find({ email: email});
    return record.length > 0;
}

module.exports = { signup, signout, generateToken, isEmailInUse };