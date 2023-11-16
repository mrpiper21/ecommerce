const express = require('express')
const { createProduct, 
    getAproduct, 
    getAllProduct, 
    updateProduct, 
    deleteProduct, 
    addToWishlist,
    uploadImages,
    rating 
} = require("../controllers/productcontroller")

const { uploadPhoto, productImgResize } = require('../middleware/uploadImages')
const router = express.Router()

const { isAdmin, authMiddleware } = require("../middleware/authmiddleware")

router.post("/", authMiddleware, isAdmin, createProduct)
router.put('/upload/:id',
authMiddleware, 
 isAdmin, 
 uploadPhoto.array('images', 10), 
 productImgResize, uploadImages)
router.get("/:id", getAproduct).get('/', getAllProduct)
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/rating', authMiddleware, rating)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

module.exports = router;