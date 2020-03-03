const chai = require('chai')
const chaiHttp = require('chai-http')
let should = chai.should(); // required for chai asserts
const server = require('../server')

const { build, fake, sequence } = require('test-data-bot')
const API_USER_URL = "/api/user"
const mongoose = require("mongoose");  // required for db operations like deleteMany
const User = require('../models/User');

chai.use(chaiHttp);

const clientUserBuilder = build('User').fields({
    name: fake(f => f.name.firstName()),
    email: fake(f => f.internet.email()),
    password: fake(f => f.internet.password()),
    empireId: "ESSOS",
    role: "CLIENT"
})

describe('User register', () => {
    let user = clientUserBuilder()
    it('should register user successfully', () => {
        chai.request(server)
            .post(API_USER_URL + '/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('role').eql(user.role)
                res.body.should.have.property('user_type').eql("ClientUser")
                res.body.should.have.property('name').eql(user.name)
                res.body.should.have.property('email').eql(user.email)
                res.body.should.have.property('empireId').eql(user.empireId.toString())
            })
    })
})

describe('User login', () => {
    let user = clientUserBuilder()
    it('should login by registered email', () => {
        chai.request(server)
            .post(API_USER_URL + '/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .post(API_USER_URL + '/login')
                    .send({ email: user.email, password: user.password })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                    })
            })
    })
})

describe('User delete', () => {
    let user = clientUserBuilder()
    it('should remove registered user by email', () => {
        chai.request(server)
            .post(API_USER_URL + '/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .delete(API_USER_URL + '/deleteByEmail')
                    .send({ email: user.email })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql("User successfully deleted!")
                        res.body.result.should.have.property('deletedCount').eql(1)
                    })
            })
    })
})