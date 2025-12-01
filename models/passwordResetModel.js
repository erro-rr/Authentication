const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        ref: 'User'
    },
    token: {
        type: String,
        default: true
    },

},
    { timestamps: true,
      collection: "password_reset" // fixed name
     }

)
module.exports = mongoose.model('passwordResetModel', passwordResetSchema);