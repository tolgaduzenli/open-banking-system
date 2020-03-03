const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateApplicationInput(data) {
    let errors = {};
    data.title = !isEmpty(data.title) ? data.title : ""
    data.createdBy = !isEmpty(data.createdBy) ? data.createdBy : ""

    if (Validator.isEmpty(data.title)) {
        errors.title = "Title field is required"
    }

    // when we get user from session on the server side, no need to have this validation
    if (Validator.isEmpty(data.createdBy)) {
        errors.createdBy = "CreatedBy field is required"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}