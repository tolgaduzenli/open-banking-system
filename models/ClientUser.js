const options = { discriminatorKey: 'user_type' };
const mongoose = require('mongoose')
const User = require('./User')

const clientUserSchema = new mongoose.Schema({
    // this should be mongoose.Schema.Types.ObjectId of Empire Model
    empireId: {
        type: String,
        required: true,
        enum: ['ESSOS', 'WESTEROS']
    },
    role: {
        type: String,
        default: "CLIENT",
        required: true
    }
}, options)

const ClientUser = User.discriminator('ClientUser',
    clientUserSchema);

module.exports = ClientUser
