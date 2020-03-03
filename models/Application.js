const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    empireId: {
        type: String,
        require: true,
        enum: ['ESSOS', 'WESTEROS']
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: "PENDING"
    },
    createdBy: {
        type: mongoose.Schema.Types.Object,
        ref: 'user'
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    reviewedBy: {
        type: mongoose.Schema.Types.Object,
        ref: 'user'
    },
    reviewdDate: {
        type: Date,
    }

})

module.exports = Application = mongoose.model('application', ApplicationSchema)