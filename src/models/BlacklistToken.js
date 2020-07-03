const { mongoose } = require('../db/database');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String
    }
});

mongoose.model('BlacklistToken', blacklistTokenSchema);