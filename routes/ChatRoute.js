const express = require('express')
const { createChat, userChats, findChat, onInteractionForChat, myChatHistory } = require('../controllers/ChatController.js')

const router = express.Router()

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat)

router.post('/onInteractionForChat', onInteractionForChat)
router.post('/myChatHistory', myChatHistory)

module.exports = router

