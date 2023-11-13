const express = require('express')
const router = express.Router()
const { createCategory, updateCategory, deleteCategory, getAllCategory, getAcategory }= require('../controllers/prductCategoryController')
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteCategory)
router.get('/', authMiddleware, getAllCategory).get('/:id', authMiddleware, getAcategory)
module.exports = router