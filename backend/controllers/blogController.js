const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb')

const createBlog = asyncHandler(async(req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async(req, res) => {
    const _id = req.params.id;
    //validateMongoDbId(_id)
    try {
        const updatedBlog = Blog.findByIdAndUpdate(_id, req.body,
        {
            new: true,
        })
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async(req, res) => {
    const _id = req.params.id
    console.log(_id)
    validateMongoDbId(_id)
    try {
        const delBog = await Blog.findByIdAndDelete({_id})
        res.json(delBog)
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = { createBlog, deleteBlog, updateBlog }