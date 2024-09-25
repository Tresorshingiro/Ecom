const express = require('express')
const {
    addToCart,
    getUserCart,
    removeItemFromCart,
    deleteCart
} = require('../controllers/cartController')

const router = express.Router()

//add an item to the cart
router.post('/', addToCart)

//get user's cart
router.get('/', getUserCart)

//remove an Item from the cart
router.delete('/item/:cartItemId', removeItemFromCart)

//delete entire cart
router.delete('/', deleteCart)

module.exports = router