const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/category', authMiddleware, categoryController )

module.exports = router