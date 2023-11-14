const express = require('express')
const router = express.Router()
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware')
const {
    getAllBlogCategory,
    createblogCategory,
    deleteblogCategory,
    updateblogCategory,
    getAblogCategory
} = require('../controllers/blogCatController')

router.post('/', authMiddleware, isAdmin, createblogCategory);
router.put('/:id', authMiddleware, isAdmin, updateblogCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteblogCategory)
router.get('/', getAllBlogCategory).get('/:id', authMiddleware, getAblogCategory)

module.exports = router