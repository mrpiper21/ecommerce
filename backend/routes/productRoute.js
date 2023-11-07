const express = require('express')
const { createProduct, getAproduct, getAllProduct, updateProduct, deleteProduct } = require("../controllers/productcontroller")
const router = express.Router()

const { isAdmin, authMiddleware } = require("../middleware/authmiddleware")

router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getAproduct).get('/', getAllProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id",authMiddleware, isAdmin, deleteProduct)

module.exports = router;