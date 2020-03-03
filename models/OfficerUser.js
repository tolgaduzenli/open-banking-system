const options = { discriminatorKey: 'user_type' };
const mongoose = require('mongoose')
const User = require('./User')

const officerUserSchema = new mongoose.Schema({
    role: {
        type: String,
        default: "OFFICER"
    }
}, options)

const OfficerUser = User.discriminator('OfficerUser',
    officerUserSchema);

module.exports = OfficerUser
