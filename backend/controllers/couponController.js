const Coupon = require('../models/couponModel')
const validateMongoDbId = require('../utils/validateMongodb')
const asyncHandler = require('express-async-handler')

const createCoupon = asyncHandler(async(req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCoupons = asyncHandler(async(req, res) => {
    try {
        const allCoupons = await Coupon.find()
        res.json(allCoupons)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler(async(req, res) => {
    const _id = req.params.id
    console.log(_id)
    validateMongoDbId(_id)
    try {
        const couponUpdate = await Coupon.findByIdAndUpdate(_id,
            req.body,
            {
                new: true,
            })
        res.json(couponUpdate)
    } catch (error) {
        throw new Error(error)
    }
})

const deletCoupon = asyncHandler(async(req, res) => {
    const _id = req.params.id;
    validateMongoDbId(_id)
    try {
        const delCoupon = await Coupon.findByIdAndDelete(_id)
        res.json(delCoupon)
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createCoupon, getAllCoupons, updateCoupon, deletCoupon }