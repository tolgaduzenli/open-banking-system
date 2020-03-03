const express = require('express')
const router = express.Router()
const applicationController = require('../../controllers/applicationController')

router.get('/findById', applicationController.findById)
router.get('/findByParam', applicationController.findByParam)
router.post('/create', applicationController.create)
router.put('/update', applicationController.update)
router.put('/changeStatus', applicationController.changeStatus)
router.delete('/delete', applicationController.delete)

module.exports = router