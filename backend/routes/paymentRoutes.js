const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
    initiatePayment,
    checkPayment,
    handleCallback
} = require('../controllers/paymentController')

router.post('/momo/initiate/:orderId', protect, initiatePayment)
router.get('/momo/status/:orderId', protect, checkPayment)
router.post('/momo-callback', handleCallback)

module.exports = router 