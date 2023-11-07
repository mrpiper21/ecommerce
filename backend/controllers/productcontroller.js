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
    const allProducts = await Product.find()
    try {
        res.json(allProducts)
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = { createProduct, getAproduct , getAllProduct, updateProduct, deleteProduct }