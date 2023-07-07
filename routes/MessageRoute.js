const express = require('express')
const { addMessage,getMessages } = require('../controllers/MessageController.js')

const router = express.Router();

router.post('/', addMessage);

router.get('/:chatRoomKey', getMessages);

module.exports = router