const express = require('express')

const {
    createReview,
    getProductReviews
} = require('../controllers/reviewController')

const router = express.Router()

//create reviews
router.post('/', createReview)

//review of an product
router.get('/:productId', getProductReviews)

module.exports = router