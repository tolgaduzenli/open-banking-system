const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validation/register')
const User = require('../models/User')
const ClientUser = require('../models/ClientUser')
const OfficerUser = require('../models/OfficerUser')

exports.register = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user && user !== null) {
            return res.status(400).json({ email: 'Email already exist' })
        } else {
            let newUser = null
            if (req.body.role === 'CLIENT') {
                newUser = new ClientUser({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    empireId: req.body.empireId
                })
                hashPasswordAndSaveUser(newUser, res)
            } else if (req.body.role === 'OFFICER') {
                newUser = new OfficerUser({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                hashPasswordAndSaveUser(newUser, res)
            } else {
                return res.status(400).json({ error: 'Unknown role!' })
            }
        }
    })

}

hashPasswordAndSaveUser = (newUser, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        })
    })
}