const User = require('../models/User')

exports.findById = (req, res) => {
    User.findById(req.body.id)
        .then(user => {
            return res.status(200).json(user)
        })
        .catch(err => {
            return res.status(400).json({ error: "User not found!" })
        })
}

exports.findByEmail = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user || user === null) {
                return res.status(400).json({ email: 'Email not found' })
            } else {
                return res.status(200).json(user)
            }
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        })
}

exports.deleteByEmail = (req, res) => {
    User.deleteOne({ email: req.body.email })
        .then(result => {
            if (result && result !== null && result.deletedCount === 1) {
                return res.json({ message: "User successfully deleted!", result });
            } else {
                return res.json({ error: "Email not found", result });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ err })
        })
}