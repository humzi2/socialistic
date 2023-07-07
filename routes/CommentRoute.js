const express = require('express')
const {createComment, getComment,updateComment, deleteComment, likeComment, getTimelineComments } = require('../controllers/CommentController.js')
const router = express.Router()

router.post('/', createComment)
router.get('/:id', getComment)
router.put('/:id', updateComment)
router.delete('/:id', deleteComment)
router.put('/:id/like', likeComment)
router.get('/:id/timeline', getTimelineComments)

module.exports = router