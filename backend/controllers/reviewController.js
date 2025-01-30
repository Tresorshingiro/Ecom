const Review = require('../models/reviewModel')
const Product = require('../models/productModel')

// Create a review
const createReview = async (req, res) => {
    try {
        const { productId } = req.params
        const { rating, comment } = req.body
        const userId = req.user._id

        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        })

        res.status(201).json(review)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params
        const reviews = await Review.find({ product: productId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })

        res.status(200).json(reviews)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update a review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params
        const { rating, comment } = req.body
        const userId = req.user._id

        const review = await Review.findOneAndUpdate(
            { _id: id, user: userId },
            { rating, comment },
            { new: true }
        )

        if (!review) {
            return res.status(404).json({ error: 'Review not found or unauthorized' })
        }

        res.status(200).json(review)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const review = await Review.findOneAndDelete({ _id: id, user: userId })

        if (!review) {
            return res.status(404).json({ error: 'Review not found or unauthorized' })
        }

        res.status(200).json(review)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
}