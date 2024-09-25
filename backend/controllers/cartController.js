const Cart = require('../models/cartModel')

//Add item to cart
const addToCart = async(req, res) => {
    const {product, quantity} = req.body
    const user = req.user._id

    try{
        const cart = await Cart.findOne({ user });
        if(cart){
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else{
                cart.items.push({product, quantity});
            }
        } else{
            const newCart = await Cart.create({user, items: [{ product, quantity}]});
            return res.status(200).json(newCart);
        }

        await cart.save();
        res.status(200).json(cart)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

//get user cart
const getUserCart = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id}).populate('items.product');
        res.status(200).json(cart)
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

// remove an item from the cart
const removeItemFromCart = async(req, res) => {
    const { cartItemId } = req.params;
    const user = req.user._id;

    try{
        const cart = await Cart.findOne({ user });

        if(!cart) {
            return res.status(404).json({error: 'Cart not found'});
        }

        cart.cartItems = cart.cartItems.filter(item => item._id.toString() !== cartItemId);

        await cart.save();

        res.status(200).json({message: 'Item removed from cart', cart})
    } catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

// delete the entire cart
const deleteCart = async (req, res) => {
    const user = req.user._id;
    
    try{
        const cart = await Cart.findOneAndDelete({user});

        if(!cart) {
            return res.status(404).json({error: 'Cart not found'});
        }
        res.status(200).json({message: 'Cart deleted successfully'})
    } catch(error){
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

module.exports = {
    addToCart,
    getUserCart,
    removeItemFromCart,
    deleteCart
}