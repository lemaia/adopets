const { mongoose } = require('../db/database');

const actionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String
    },
    params: {
        type: mongoose.Schema.Types.Mixed
    }
});

mongoose.model('ActionLog', actionLogSchema);