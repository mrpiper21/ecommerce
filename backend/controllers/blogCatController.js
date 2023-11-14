const blogcategory = require('../models/blogCatModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb')

const getAllBlogCategory = asyncHandler(async(req, res) => {
    try {
        const findAll = await blogcategory.find()
        res.json(findAll)
    } catch (error) {
        throw new Error(error)
    }
})

const getAblogCategory = asyncHandler(async(req, res) => {
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        const getblogCategory = await blogcategory.findById(_id)
        res.json(getblogCategory)
    } catch (error) {
        throw new Error(error)
    }
})
const createblogCategory = asyncHandler(async(req, res) => {
    const category = req.body
    try {
        const newCategory = await blogcategory.create(category)
        res.status(201).json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateblogCategory = asyncHandler(async(req, res) => {
    const _id = req.params.id;
    console.log(_id)
    validateMongoDbId(_id)
    try {
        const updatecat = await blogcategory.findByIdAndUpdate(_id, req.body,
            { new: true})
        res.status(200).json(updatecat)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteblogCategory = asyncHandler(async(req, res) => {
    const _id = req.params.id
    validateMongoDbId(_id)
    try {
        const Delete = await blogcategory.findOneAndDelete(_id)
        res.json(Delete)
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createblogCategory , updateblogCategory, deleteblogCategory, getAllBlogCategory, getAblogCategory }