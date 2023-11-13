const ProductCategory = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb')

const getAllCategory = asyncHandler(async(req, res) => {
    try {
        const findAll = await ProductCategory.find()
        res.json(findAll)
    } catch (error) {
        throw new Error(error)
    }
})

const getAcategory = asyncHandler(async(req, res) => {
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        const getCategory = await ProductCategory.findById(_id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})
const createCategory = asyncHandler(async(req, res) => {
    const category = req.body
    try {
        const newCategory = await ProductCategory.create(category)
        res.status(201).json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory = asyncHandler(async(req, res) => {
    const _id = req.params.id;
    console.log(_id)
    validateMongoDbId(_id)
    try {
        const updatecat = await ProductCategory.findByIdAndUpdate(_id, req.body,
            { new: true})
        res.status(200).json(updatecat)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async(req, res) => {
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        const Delete = await ProductCategory.findOneAndDelete(_id)
        res.json(Delete)
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createCategory , updateCategory, deleteCategory, getAllCategory, getAcategory }