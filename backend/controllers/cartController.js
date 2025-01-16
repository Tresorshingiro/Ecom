const Cart = require('../models/cartModel')

//Add item to cart
const addToCart = async(req, res) => {
    try {
        const { items } = req.body
        const user = req.user._id

        let cart = await Cart.findOne({ user })

        if (cart) {
            // Update existing cart
            cart.items = items.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                size: item.size
            }))
        } else {
            // Create new cart
            cart = await Cart.create({
                user,
                items: items.map(item => ({
                    product: item.productId,
                    quantity: item.quantity,
                    size: item.size
                }))
            })
        }

        await cart.save()
        
        // Populate product details before sending response
        await cart.populate('items.product')
        
        res.status(200).json(cart)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

//get user cart
const getUserCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product')
        
        if (!cart) {
            return res.status(200).json({ items: [] })
        }
        
        res.status(200).json(cart)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// remove an item from the cart
const removeItemFromCart = async(req, res) => {
    try {
        const { cartItemId } = req.params
        const user = req.user._id

        const cart = await Cart.findOne({ user })

        if (!cart) {
            return res.status(404).json({error: 'Cart not found'})
        }

        cart.items = cart.items.filter(item => 
            item._id.toString() !== cartItemId
        )

        await cart.save()
        await cart.populate('items.product')

        res.status(200).json(cart)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

// delete the entire cart
const deleteCart = async(req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.user._id })

        if (!cart) {
            return res.status(404).json({error: 'Cart not found'})
        }
        
        res.status(200).json({ message: 'Cart deleted successfully' })
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    addToCart,
    getUserCart,
    removeItemFromCart,
    deleteCart
}