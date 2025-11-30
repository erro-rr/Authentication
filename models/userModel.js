const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    isVerified: {
        type: Number,
        default: 0 // 0 for unverified and 1 for verified
    },
    image: {
        type: String,
        required: true
    }
},
    { timestamps: true },
    {
        collection: "User"
    }
)

module.exports = mongoose.model('User', userSchema);