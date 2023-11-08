const { query } = require("express")
const Product = require("../models/productmodel")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

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

module.exports = { createProduct, getAproduct , getAllProduct, updateProduct, deleteProduct }