const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
    saveCart,
    getCart
} = require('../controllers/cartController')

// Protected routes
router.post('/', protect, saveCart)
router.get('/', protect, getCart)

module.exports = router