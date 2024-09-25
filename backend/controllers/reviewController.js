const Review = require('../models/reviewModel')

// create a review
const createReview = async(req, res) => {
    const {product, rating, comment} = req.body;
    const user = req.user._id

    try{
        const review = await Review.create({user, product, rating, comment})
        res.status(200).json(review)
    }catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

// get product reviews
const getProductReviews = async(req, res) => {
    const { productId } = req.params;

    try{
        const reviews = await Review.find({product: productId}).populate('user');
        res.status(200).json(reviews)
    }catch(error) {
        console.error('Error:', error)
        res.status(400).json({error: error.message})
    }
};

module.exports = {
    createReview,
    getProductReviews
}