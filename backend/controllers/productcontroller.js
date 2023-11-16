const { query } = require("express")
const Product = require("../models/productmodel")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const cloudinaryUploadImg = require('../utils/cloudinary')
const User = require('../models/userModel')
const fs = require('fs')
const validateMongoDbId = require("../utils/validateMongodb")

const createProduct = asyncHandler(async(req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async(req, res) => {
    const id = req.params.id
    // console.log(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const update = await Product.findByIdAndUpdate(id, req.body,
            {
                new: true,
            })
        res.json(update)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async(req, res) => {
    const { id } = req.params
    // console.log(id)
    try {
        const deleteproduct = await Product.findByIdAndDelete(id)
        res.json(deleteproduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getAproduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async(req, res) => {
    try {
        const queryObj = { ...req.query}
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((i) => delete queryObj[i])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let allProducts = Product.find(JSON.parse(queryStr))

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            allProducts = allProducts.sort(sortBy)
        } else {
            allProducts = allProducts.sort("-createdAt");
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            allProducts = allProducts.select(fields)
        } else {
            allProducts = allProducts.select('-__v')
        }

        // Pagination

        const page = req.query.page;
        const limit = req.query.limit
        const skip = (page - 1) * limit
        allProducts = allProducts.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount) throw new Error('This Page does not exist')
        }
        console.log(page, limit,skip)

        const products = await allProducts;

        res.status(200).json(products)
    } catch (error) {
        throw new Error(error);
    }
})

 const addToWishlist = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body
    try {
        const user = await User.findById(_id)
        const alreadyadded = user.wishlist.find((id)=>id.toString() === prodId)
        if(alreadyadded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId },
            },
            {
                new: true,
            })
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                })
                res.json(user)
            }
    } catch (error) {
        throw new Error(error)
    }
 })

 const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId)
        let alreadyRated = product.ratings.find((userId)=> userId.postedby.toString() === _id.toString())
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set:{'ratings.$.star': star, 'ratings.$.comment': comment},
                },
                {
                    new: true,
                })
        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId,
                {
                    $push: { ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id,
                        },
                    
                    },
                    new: true,
                })
        }
        const getallratings = await Product.findById(prodId)
        let totalrating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0)
        let actualRating = Math.round(ratingsum / totalrating)
        let finalproduct = await Product.findByIdAndUpdate(prodId, {
            totalrating: actualRating,
        }, { new: true })
        res.json(finalproduct)
    } catch (error) {
        throw new Error(error)
    }

})

 const uploadImages = asyncHandler(async(req, res)=> {
    const _id = req.params.id;
    validateMongoDbId(_id)
    try {
        const uploader = (path)=> cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files;
        for(const file of files){
            const { path } = file
            const newpath = uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findProduct = await Product.findByIdAndUpdate(_id, {
            images: urls.map((file) => {
                return file
            }),
        },{
            new: true,
        })
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
 })

module.exports = { createProduct, 
    getAproduct , 
    getAllProduct, 
    updateProduct, 
    deleteProduct,
    addToWishlist,
    uploadImages, 
    rating }