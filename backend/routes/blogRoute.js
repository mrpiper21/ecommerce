const express = require('express')
const { createBlog, deleteBlog, updateBlog, getBlog, getAllBlogs, likeBlog, disLikeBlog } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');
const router = express.Router()

router.post('/post',authMiddleware, isAdmin ,createBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.put('/likes', authMiddleware, likeBlog).put('/dislikes', authMiddleware, disLikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)

module.exports = router;