const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        default: true,
        ref: 'User'
    },
    token: {
        type: String,
        default: true
    }

})
module.exports = mongoose.model('passwordReset', passwordResetSchema);