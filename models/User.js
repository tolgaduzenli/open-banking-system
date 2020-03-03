const mongoose = require('mongoose')
const options = { discriminatorKey: 'user_type' };

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
}, options)

module.exports = User = mongoose.model("user", UserSchema)