const express = require('express');
const { mongoose } = require('../db/database');
const ActionLog = mongoose.model('ActionLog');

const logAction = async (userId, action, params) => {
    const log = new ActionLog({ userId: userId, action, params });
    await log.save()
}

module.exports = {logAction};