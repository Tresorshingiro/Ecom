const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')

// Review routes
router.get('/:productId', getProductReviews)
router.post('/:productId', protect, createReview)
router.patch('/:productId/:reviewId', protect, updateReview)
router.delete('/:productId/:reviewId', protect, deleteReview)

module.exports = router