const Application = require('../models/Application')
const User = require('../models/User')
const validateApplicationInput = require('../validation/applicationValidation')
const ObjectId = require('mongoose').Types.ObjectId;

exports.create = (req, res) => {
    const { errors, isValid } = validateApplicationInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }
    // First find user then save application
    User.findById(req.body.createdBy).then(user => {
        const application = new Application({
            title: req.body.title,
            description: req.body.description,
            createdBy: user._id,
            empireId: user.empireId
        })

        application.save()
            .then(application => res.status(200).json(application))
            .catch(err => res.status(500).json({ error: 'Application could not saved' }));
    }).catch(err => {
        console.log(err)
        return res.status(404).json({ error: "Owner not found" })
    })
}

exports.findByParam = (req, res) => {
    const queryParams = {}

    if (req.query.empireId && req.query.empireId !== null) {
        queryParams.empireId = req.query.empireId
    }
    if (req.query.status && req.query.status !== null) {
        queryParams.status = req.query.status.toUpperCase()
    }

    if (req.query.createdBy && req.query.createdBy !== null) {
        queryParams.createdBy = new ObjectId(req.query.createdBy)
    }

    Application.find(queryParams)
        .populate({ path: 'createdBy', select: 'name' })
        .populate({ path: 'reviewedBy', select: 'name' })
        .exec(function (err, application) {
            if (err) {
                return res.status(404).json({ error: "Application not found" })
            } else {
                return res.status(200).json(application)
            }
        })
}

exports.findById = (req, res) => {
    Application.findById(req.query.id)
        .populate({ path: 'createdBy', select: 'name' })
        .populate({ path: 'reviewedBy', select: 'name' })
        .exec(function (err, application) {
            if (err) {
                return res.status(404).json({ error: "Application not found" })
            } else {
                return res.status(200).json(application)
            }
        })
}
// Only user can update his/her own applications and status must be PENDING
exports.update = (req, res) => {
    Application.findById(req.body.id)
        .then(existApplication => {
            if (existApplication.status === 'PENDING' && parseInt(req.body.createdBy) === parseInt(existApplication.createdBy)) {
                if (req.body.title && req.body.title !== null) {
                    existApplication.title = req.body.title
                }
                if (req.body.description && req.body.description !== null) {
                    existApplication.description = req.body.description
                }
                existApplication.save()
                    .then(app => res.status(200).json(app))
                    .catch(err => res.status(500).json({ error: "Application could not updated" }))
            } else {
                return res.status(405).json({ error: "Application can not be updated" })
            }
        }).catch(err => {
            return res.status(404).json({ error: "Application not found" })
        })
}

// IF application status is PENDING, then status can be changed
exports.changeStatus = (req, res) => {
    Application.findById(req.body.id)
        .then(existApplication => {
            if (existApplication.status === 'PENDING') {
                User.findById(req.body.reviewerId)
                    .then(user => {
                        if (req.body.newStatus && req.body.newStatus !== null
                            && (req.body.newStatus === 'APPROVED' || req.body.newStatus === 'REJECTED')) {
                            existApplication.status = req.body.newStatus
                            existApplication.reviewedBy = user._id
                            existApplication.reviewdDate = new Date()
                            existApplication.save()
                                .then(app => res.status(200).json(app))
                                .catch(err => res.status(500).json({ error: "Application could not updated" }))
                        }
                    }).catch(err => res.status(404).json({ error: "Reviewer could not found" }))
            } else {
                return res.status(405).json({ error: "Application status can not change" })
            }
        }).catch(err => {
            return res.status(404).json({ error: "Application not found" })
        })
}

// If Application status is PENDING, then can be deleted
exports.delete = (req, res) => {
    // Add user id check
    Application.findById(req.query.id)
        .then(application => {
            if (application.status === 'PENDING') {
                Application.deleteOne({ _id: new ObjectId(req.query.id) })
                    .then(result => {
                        if (result && result !== null && result.deletedCount === 1) {
                            return res.status(200).json({ message: "Application successfully deleted!", result })
                        } else {
                            return res.status(404).json({ error: "Application not found", result })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({ err })
                    })
            } else {
                return res.status(405).json({ error: "Application can not delete" })
            }
        }).catch(err => res.status(404).json({ error: "Application not found", result }))

}