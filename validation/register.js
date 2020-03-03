const Validator = require('validator')
const isEmpty = require('is-empty')
const availableRoles = require('../constants/roles')

module.exports = function validateRegisterInput(data) {
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name : ""
    data.email = !isEmpty(data.email) ? data.email : ""
    data.password = !isEmpty(data.password) ? data.password : ""
    data.role = !isEmpty(data.role) ? data.role : ""

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required'
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required'
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.role)) {
        errors.role = "Role field is required";
    } else if (!availableRoles.includes(data.role)) {
        errors.role = "Role is not correct";
    }

    if (data.role === 'CLIENT' && Validator.isEmpty(data.empireId)) {
        errors.empireId = "EmpireId field is required";
    }

    return {
        errors, isValid: isEmpty(errors)
    }
}