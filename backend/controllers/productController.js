const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Type = require('../models/typeModel')

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('category', 'name')
            .populate('type', 'name')
            .lean()

        if (!products) {
            return res.status(404).json({ message: 'No products found' })
        }

        // Transform the response to include full image URLs
        const transformedProducts = products.map(product => ({
            ...product,
            images: product.images.map(image => 
                image.startsWith('http') ? image : image.startsWith('/uploads/') ? image : `/uploads/${image}`
            )
        }))
        
        res.status(200).json(transformedProducts)
    } catch (error) {
        console.error('Error in getProducts:', error)
        res.status(500).json({ 
            message: 'Error fetching products',
            error: error.message 
        })
    }
}

// Get single product
const getProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
            .populate('category', 'name')
            .populate('type', 'name')
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // Transform the response to include full image URLs
        const transformedProduct = {
            ...product.toObject(),
            images: product.images.map(image => 
                image.startsWith('http') ? image : image.startsWith('/uploads/') ? `http://localhost:4000${image}` : `http://localhost:4000/uploads/${image}`
            )
        }
        
        res.status(200).json(transformedProduct)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Create new product
const createProduct = async (req, res) => {
    try {
        // Get the uploaded files
        const files = req.files;
        const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];

        const { 
            name, 
            description, 
            price,
            brand,
            category,
            type,
            sizes,
            stockQuantity,
            bestSeller 
        } = req.body;

        // Convert sizes from string to array if it's not already
        const sizesArray = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

        // Create the product with image URLs
        const product = await Product.create({ 
            name, 
            description, 
            price: Number(price),
            brand,
            category,
            type,
            sizes: sizesArray,
            stockQuantity: Number(stockQuantity),
            images: imageUrls,
            bestSeller: bestSeller === 'true'
        })

        // Transform the response to include full image URLs
        const transformedProduct = {
            ...product.toObject(),
            images: product.images.map(image => 
                image.startsWith('http') ? image : `http://localhost:4000${image}`
            )
        }

        res.status(201).json(transformedProduct)
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ error: error.message })
    }
}

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const files = req.files;
        const newImageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
        
        // Get existing images from request body
        const existingImages = req.body.existingImages || [];
        const imagesToKeep = Array.isArray(existingImages) ? existingImages : [existingImages];

        // Combine existing and new images
        const allImages = [...imagesToKeep, ...newImageUrls];

        // Convert sizes from string to array if it's not already
        const sizes = req.body.sizes;
        const sizesArray = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

        const updateData = {
            ...req.body,
            images: allImages,
            sizes: sizesArray,
            price: Number(req.body.price),
            stockQuantity: Number(req.body.stockQuantity)
        };

        const product = await Product.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // Transform the response to include full image URLs
        const transformedProduct = {
            ...product.toObject(),
            images: product.images.map(image => 
                image.startsWith('http') ? image : `http://localhost:4000${image}`
            )
        }

        res.status(200).json(transformedProduct)
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: error.message })
    }
}

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update product stock
const updateStock = async (req, res) => {
    try {
        const { id } = req.params
        const { inventory } = req.body

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // Update inventory quantities
        inventory.forEach(item => {
            const inventoryItem = product.inventory.find(i => i.size === item.size)
            if (inventoryItem) {
                inventoryItem.quantity = item.quantity
            }
        })

        // Update inStock based on total inventory
        product.inStock = product.inventory.some(item => item.quantity > 0)

        await product.save()
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Check stock availability
const checkStock = async (req, res) => {
    try {
        const { id } = req.params
        const { size, quantity } = req.body

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        const inventoryItem = product.inventory.find(item => item.size === size)
        const available = inventoryItem && inventoryItem.quantity >= quantity

        res.status(200).json({ available })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    checkStock
}