const chai = require('chai');
const expect = chai.expect;
const validateLoginInput = require('../validation/login')

describe('Login validation', () => {
    it("returns 'Email field is required' error when email is not exist", () => {
        const user = {
            email: "", password: "pwd"
        }
        const { errors, isValid } = validateLoginInput(user)
        expect(errors.email).to.equal("Email field is required");
        expect(isValid).to.be.false
    })

    it("returns 'Email is invalid' error when email is not valid", () => {
        const user = {
            email: "email", password: "pwd"
        }
        const { errors, isValid } = validateLoginInput(user)
        expect(errors.email).to.equal("Email is invalid");
        expect(isValid).to.be.false
    })

    it("returns 'Password field is required' error when password is not exit", () => {
        const user = {
            email: "email@email.com", password: ""
        }
        const { errors, isValid } = validateLoginInput(user)
        expect(errors.password).to.equal("Password field is required");
        expect(isValid).to.be.false
    })

    it("returns success when there is no error", () => {
        const user = {
            email: "email@email.com", password: "pwd"
        }
        const { errors, isValid } = validateLoginInput(user)
        expect(isValid).to.be.true
        expect(errors.password).to.be.undefined;
        expect(errors.email).to.be.undefined;
    })
})
