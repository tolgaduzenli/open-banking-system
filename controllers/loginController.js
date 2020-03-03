const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const validateLoginInput = require('../validation/login')
const User = require('../models/User')

exports.login = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password

    User.findOne({ email }).then(user => {
        if (!user || user === null) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched. Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    empireId: user.empireId
                }
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        })
                    }
                )
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
}