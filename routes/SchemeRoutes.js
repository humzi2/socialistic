const express = require('express')
const { userScheme } = require ('../controllers/SchemeController.js')

const router = express.Router()

router.post('/createuser', userScheme)

module.exports = router


