const Cart = require('../models/cartModel')

// Save cart
const saveCart = async (req, res) => {
    try {
        const { items } = req.body
        const userId = req.user._id

        let cart = await Cart.findOne({ user: userId })
        
        if (cart) {
            cart.items = items
            await cart.save()
        } else {
            cart = await Cart.create({
                user: userId,
                items
            })
        }

        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get cart
const getCart = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId })
        res.status(200).json(cart || { items: {} })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    saveCart,
    getCart
}