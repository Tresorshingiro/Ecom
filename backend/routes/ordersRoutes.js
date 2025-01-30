const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/ordersController')

// Apply requireAuth middleware to specific routes instead of using router.use()
router.post('/', protect, createOrder)
router.get('/', protect, getUserOrders)
router.get('/:id', protect, getOrderById)
router.patch('/:id/status', protect, updateOrderStatus)

module.exports = router
