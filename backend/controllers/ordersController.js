const Order = require('../models/orderModel')
const Product = require('../models/productModel')

// Create new order
const createOrder = async (req, res) => {
    try {
        const { items, shippingDetails, totalAmount } = req.body
        const userId = req.user._id

        // Create order
        const order = await Order.create({
            user: userId,
            items,
            shippingDetails,
            totalAmount,
            status: 'pending'
        })

        // Update stock for each item
        for (const [productId, sizes] of Object.entries(items)) {
            const product = await Product.findById(productId)
            if (!product) continue

            for (const [size, quantity] of Object.entries(sizes)) {
                if (product.stockQuantity < quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`)
                }
                product.stockQuantity -= quantity
                await product.save()
            }
        }

        res.status(201).json(order)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get specific order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status },
            { new: true }
        )
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} 