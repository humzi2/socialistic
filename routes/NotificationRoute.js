const express = require('express')
const { getNotifications, notify } = require('../controllers/NotificationController.js')

const router = express.Router()

router.post('/', notify)
router.get('/getNotifications', getNotifications)

module.exports = router

