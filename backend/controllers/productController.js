 const Product = require('../models/productModel')
 const mongoose = require('mongoose')

 //Get all products
 const getAllProducts = async(req, res) => {
    try{
        const products = await Product.find().populate('category'). sort({createdAt: -1});
        res.status(200).json(products);
    } catch(error){
        console.error('Error:', error)
        res.status(400).json({error: 'Internal Server Error'})
    }
 }

 //Get a single Product
 const getProductById = async(req, res) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return res.status(404).json({error: 'Product not found'})
        }
        res.status(200).json(product)
    } catch(error) {
        console.error('Error getting Product by Id:', error)
        res.status(400).json({error: 'Internal Server Error'})
    }
 }


 //Create Product

 const createProduct = async (req, res) => {
    const {name, description, price, category, stockQuantity, brand} = req.body
    if (!req.file) {
        return res.status(400).json({error: 'Image file is required'});
    }
    const image =`/uploads/${req.file.filename}`;
    try{
        const product = await Product.create({name, description, price, category, stockQuantity, image, brand})
        res.status(200).json(product)
    } catch(error){
        console.error('Error:', error)
        res.status(400).json({error: 'Internal Server Error'})
    }
 }


//update Product
const updateProductById = async (req, res) => {
    const { id } = req.params
    const updatedData = req.body
    if (req.file) {
        updatedData.image = `/uploads/${req.file.filename}`;
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {new: true})
        if(!updatedProduct) {
            return res.status(404).json({error: 'Product not found'})
        }
        res.status(200).json(updatedData)
    } catch(error){
        console.error('Error:', error)
        res.status(400).json({error: 'Internal Server Error'})
    }
}


//delete Product
const deleteProductById = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:'No such Product'})
    }

    try{
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({error: 'Product not found'})
        }
        res.status(200).json({message: 'Product Successfully Deleted'})
    } catch(error){
        console.error('Error:', error)
        res.status(400).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
}