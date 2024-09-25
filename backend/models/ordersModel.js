const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    orderItems: [
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required:true
            },
            quantity: {
                type:Number,
                required:true
            },
            price: {
                type:Number,
                required:true
            }
        }
    ],
    totalPrice: {
        type:Number,
        required:true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema)