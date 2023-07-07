const express = require('express')
const { createPost, timeline, getMyPosts, test, likePost , comment  } = require('../controllers/PostController.js')
const router = express.Router()

router.post('/create', createPost)
router.get('/timeline', timeline)
router.get('/myposts', getMyPosts)
router.get('/test', test)
router.get('/updateComments', test)
router.get('/updateLikes', test)
router.post('/like', likePost)
router.post('/comment', comment)


module.exports = router