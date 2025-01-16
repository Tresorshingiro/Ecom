const express = require('express')
const router = express.Router()
const {
    addToCart,
    getUserCart,
    removeItemFromCart,
    deleteCart
} = require('../controllers/cartController')
const requireAuth = require('../middleware/requireAuth')

// Protect all cart routes
router.use(requireAuth)

// Routes
router.post('/', addToCart)
router.get('/', getUserCart)
router.delete('/item/:cartItemId', removeItemFromCart)
router.delete('/', deleteCart)

module.exports = router