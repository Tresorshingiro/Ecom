const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
    createReview,
    getProductReviews,
    updateReview,
    deleteReview 
} = require('../controllers/reviewController')

// Get reviews for a product
router.get('/:productId', getProductReviews)

// Protected routes
router.post('/:productId', protect, createReview)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

module.exports = router