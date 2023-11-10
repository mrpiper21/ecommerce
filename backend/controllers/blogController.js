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
        const updatedBlog = await Blog.findByIdAndUpdate(_id, req.body,
        {
            new: true,
        })
        if (!updateBlog) {
            res.status(500).json({
                msg: "There was an error please try again",
                success: false,
            })
        }
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async(req, res) => {
    const _id = req.params.id;
    console.log(_id)
    validateMongoDbId(_id)
    try {
        const blog = await Blog.findByIdAndUpdate(_id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );
        res.json(blog)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlogs = asyncHandler(async(req, res) => {
    try {
        const allBlogs = await Blog.find();
        if (!allBlogs) {
            res.json({
                msg: 'There was an error please try again',
                success: false,
            })
        }
        res.status(200).json(allBlogs)
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

const likeBlog = asyncHandler(async(req, res) => {
    // console.log(req.body)
    const { blogId } = req.body;
    validateMongoDbId(blogId)
    
    // Finf the blog which you want to like
    const blog = await Blog.findById(blogId )
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the post 
    const isLiked =  blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
        { new: true })
        res.json(blog)
    }
    if (isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            $set: { isLiked: false },
        },
        { new: true })
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            likes: loginUserId,
            isLiked: true,
        },
        { new: true })
        res.json(blog)
    }
})


const disLikeBlog = asyncHandler(async(req, res) => {
    // console.log(req.body)
    const { blogId } = req.body;
    validateMongoDbId(blogId)
    
    // Finf the blog which you want to like
    const blog = await Blog.findById(blogId )
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the post 
    const isDisLiked =  blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyliked = blog?.likes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if (alreadyliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isliked: false,
        },
        { new: true })
        res.json(blog)
    }
    if (isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            $set: { isDisliked: false },
        },
        { new: true })
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            dislikes: loginUserId,
            isDisliked: true,
        },
        { new: true })
        res.json(blog)
    }
})

module.exports = { createBlog, 
    deleteBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    likeBlog, 
    disLikeBlog}