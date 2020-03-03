const chai = require('chai');
const expect = chai.expect;
const validateRegisterInput = require('../validation/register')

describe('Register validation', () => {
    it("returns 'Email field is required' error when email is not exist", () => {
        const user = {
            email: "", password: "pwd", name: "test"
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.email).to.equal("Email field is required");
        expect(isValid).to.be.false
    })

    it("returns 'Email is invalid' error when email is not valid", () => {
        const user = {
            email: "email", password: "pwd", name: "test"
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.email).to.equal("Email is invalid");
        expect(isValid).to.be.false
    })

    it("returns 'Password field is required' error when password is not exist", () => {
        const user = {
            email: "email@email.com", password: "", name: "test"
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.password).to.equal("Password field is required");
        expect(isValid).to.be.false
    })

    it("returns 'Name field is required' error when name is not exist", () => {
        const user = {
            email: "email@email.com", password: "pwd", name: ""
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.name).to.equal("Name field is required");
        expect(isValid).to.be.false
    })

    it("returns 'Role field is required' error when role is not exist", () => {
        const user = {
            email: "email@email.com", password: "pwd", name: "name", role: ""
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.role).to.equal("Role field is required");
        expect(isValid).to.be.false
    })

    it("returns 'Role is not correct' error when role is not correct", () => {
        const user = {
            email: "email@email.com", password: "pwd", name: "name", role: "role"
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.role).to.equal("Role is not correct");
        expect(isValid).to.be.false
    })

    it("returns 'EmpireId field is required' error when role is CLIENT and empireId is not exist", () => {
        const user = {
            email: "email@email.com",
            password: "pwd",
            name: "name",
            role: "CLIENT",
            empireId: ""
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(errors.empireId).to.equal("EmpireId field is required");
        expect(isValid).to.be.false
    })

    it("returns success when there is no error", () => {
        const user = {
            email: "email@email.com",
            password: "pwd",
            name: "test",
            role: "CLIENT",
            empireId: "ESSOS"
        }
        const { errors, isValid } = validateRegisterInput(user)
        expect(isValid).to.be.true
        expect(errors.password).to.be.undefined;
        expect(errors.email).to.be.undefined;
    })
})
