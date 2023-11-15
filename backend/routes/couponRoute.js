const express = require('express')
const { createCoupon, getAllCoupons, updateCoupon, deletCoupon } = require('../controllers/couponController')
const { authMiddleware, isAdmin } = require('../middleware/authmiddleware')
const router = express.Router()

router.post('/', authMiddleware, isAdmin, createCoupon)
router.get('/', authMiddleware,isAdmin, getAllCoupons)
router.put('/:id', authMiddleware,isAdmin, updateCoupon)
router.delete('/:id', authMiddleware, isAdmin, deletCoupon)
module.exports = router;