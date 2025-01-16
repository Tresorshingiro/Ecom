const Review = require('../models/reviewModel')
const Product = require('../models/productModel')
const mongoose = require('mongoose')

// create a review
const createReview = async(req, res) => {
    const {product, rating, comment} = req.body;
    const user = req.user._id;

    try {
        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ user, product });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Create the review
        const review = await Review.create({
            user,
            product,
            rating: Number(rating),
            comment
        });

        // Update product's rating and numReviews
        const allProductReviews = await Review.find({ product });
        const avgRating = allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length;

        await Product.findByIdAndUpdate(product, {
            rating: avgRating,
            numReviews: allProductReviews.length
        });

        res.status(201).json(review);
    } catch(error) {
        console.error('Error:', error);
        res.status(400).json({error: error.message});
    }
};

// get product reviews
const getProductReviews = async(req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch(error) {
        console.error('Error:', error);
        res.status(400).json({error: error.message});
    }
};

// update a review
const updateReview = async(req, res) => {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user._id;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if review belongs to user
        if (review.user.toString() !== user.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this review' });
        }

        // Update review
        review.rating = Number(rating);
        review.comment = comment;
        await review.save();

        // Update product's average rating
        const allProductReviews = await Review.find({ product: productId });
        const avgRating = allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length;

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating
        });

        res.status(200).json(review);
    } catch(error) {
        console.error('Error:', error);
        res.status(400).json({error: error.message});
    }
};

// delete a review
const deleteReview = async(req, res) => {
    const { productId, reviewId } = req.params;
    const user = req.user._id;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if review belongs to user
        if (review.user.toString() !== user.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        // Update product's rating and numReviews
        const allProductReviews = await Review.find({ product: productId });
        const avgRating = allProductReviews.length > 0
            ? allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length
            : 0;

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating,
            numReviews: allProductReviews.length
        });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch(error) {
        console.error('Error:', error);
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
}