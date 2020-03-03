const chai = require('chai')
const chaiHttp = require('chai-http')
let should = chai.should(); // required for chai asserts
const server = require('../server')

const { build, fake, sequence } = require('test-data-bot')
const { API_APPLICATION_URL, API_USER_URL } = require('../constants/API_URL')
const mongoose = require("mongoose");  // required for db operations like deleteMany
const User = require('../models/User');
const ClientUser = require('../models/ClientUser');
const Application = require('../models/Application');

chai.use(chaiHttp);

const clientUserBuilder = build('User').fields({
    name: fake(f => f.name.firstName()),
    email: fake(f => f.internet.email()),
    password: fake(f => f.internet.password()),
    empireId: "ESSOS",
    role: 'CLIENT'
})

const applicationBuilder = build('Application').fields({
    title: fake(f => f.lorem.word()),
    description: fake(f => f.lorem.word())
})

describe('Application API /create', () => {
    it('creates application successfully', () => {
        // first create user then create application
        let user = clientUserBuilder()
        chai.request(server)
            .post(API_USER_URL + '/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                const application = applicationBuilder()
                application.createdBy = res.body._id

                chai.request(server)
                    .post(API_APPLICATION_URL + '/create')
                    .send(application)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql(application.title)
                        res.body.should.have.property('description').eql(application.description)
                    })
            })
    })
})

describe('Application API /update', () => {

    it('updates created application successfully', () => {
        // first create user then create application
        const application = applicationBuilder()
        let user = clientUserBuilder()
        const clientUser = new ClientUser({ ...user })
        clientUser.save().then((user) => {
            application.createdBy = user._id
            application.empireId = user.empireId

            const dbApplication = new Application({ ...application })
            dbApplication.save().then(createdApp => {
                const newApp = {
                    title: "new title",
                    id: createdApp._id,
                    description: createdApp.description,
                    createdBy: user._id
                }
                chai.request(server)
                    .put(API_APPLICATION_URL + '/update')
                    .send(newApp)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql(newApp.title)
                        res.body.should.have.property('description').eql(newApp.description)
                    })
            })
        })
    })
})

describe('Application API /delete', () => {
    it('deletes given application', () => {

    })
})

describe('Application API /changeStatus', () => {
    it('changes status of given application', () => {

    })
})
