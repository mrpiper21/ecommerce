const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware')

router.post("/", authMiddleware, isAdmin, categoryController);
module.exports = router