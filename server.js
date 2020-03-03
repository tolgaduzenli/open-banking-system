const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors');
const dbconfig = require('./config/dbconfig')
const user = require('./routes/api/user')
const application = require('./routes/api/application')

const env = process.env.NODE_ENV || 'stage';
const port = process.env.PORT || 5000

// DB configuration
mongoose.connect(dbconfig[env], { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB succcessfully connected'))
    .catch(err => console.log(err))

const app = express()
// CORS middlewre
app.use(cors());
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Passport middleware
app.use(passport.initialize())
// Passport config
require('./config/passport')(passport)

// Initializing Routes
app.use('/api/user', user)
app.use('/api/application', application)

const server = app.listen(port, () => console.log(`Server is up and running on port ${port}`))

module.exports = server

