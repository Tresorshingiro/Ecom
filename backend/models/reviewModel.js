const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reviewSchema = new Schema({
    user: {
        type: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        product: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        rating: {
            type:Number,
            required:true
        },
        comment: {
            type:String,
            required:true
        },
        createdAt: {
            type:Date,
            default:Date.now
        }
    }
});

module.exports = mongoose.model('Review', reviewSchema)