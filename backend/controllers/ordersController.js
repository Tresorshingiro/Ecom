const Order = require('../models/orderModel')
const Product = require('../models/productModel')

// Create new order
const createOrder = async (req, res) => {
    try {
        const { items, shippingDetails, totalAmount } = req.body;
        const userId = req.user._id;

        // Validate payment method
        if (!['stripe', 'cash'].includes(shippingDetails.paymentMethod)) {
            return res.status(400).json({ error: 'Invalid payment method' });
        }

        // Validate required fields in shippingDetails
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'street', 'state', 'country', 'zipCode'];
        for (const field of requiredFields) {
            if (!shippingDetails[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required and must not be empty' });
        }

        // Create order
        const order = await Order.create({
            user: userId,
            items,
            shippingDetails,
            totalAmount,
            status: 'pending',
            paymentStatus: shippingDetails.paymentMethod === 'cash' ? 'pending' : 'paid'
        });

        // Update stock for each item
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            if (product.stockQuantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'items.productId',
                select: 'name price images'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'items.productId',
                model: 'Product',
                select: 'name price images'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get specific order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        .populate({
            path: 'items.productId',
            select: 'name price images'
        });
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
    updateOrderStatus,
    getAllOrders
} 