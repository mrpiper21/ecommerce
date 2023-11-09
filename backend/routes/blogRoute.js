const express = require('express')
const { createBlog, deleteBlog, updateBlog, getBlog, getAllBlogs, likeBlog } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');
const router = express.Router()

router.post('/post',authMiddleware, isAdmin ,createBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.put('/likes', authMiddleware, isAdmin, likeBlog)

module.exports = router;