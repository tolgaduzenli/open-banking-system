const express = require('express')
const router = express.Router()
const loginController = require('../../controllers/loginController')
const registerController = require('../../controllers/registerController')
const userController = require('../../controllers/userController')

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/findById', userController.findById)
router.get('/findByEmail', userController.findByEmail)
router.delete('/deleteByEmail', userController.deleteByEmail)

module.exports = router