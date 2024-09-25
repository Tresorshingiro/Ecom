const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true  
    },
    price: {
        type: Number,
        required: true,
        default:0
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    image:{
        type: String,
        required: true
        },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        reuired: true,
        ref: 'User',
    }
},
{
    timestamps: true,
} 
);

module.exports = mongoose.model('Product', productsSchema)
