const Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb')


const createCategory = asyncHandler(async(req, res) => {
    const category = req.body
    try {
        const newCategory = await Category.create(category)
        res.status(201).json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createCategory }