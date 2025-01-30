const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: Map,
        of: {
            type: Map,
            of: Number
        },
        required: true
    },
    shippingDetails: {
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['momo', 'cash'],
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    momoPaymentDetails: {
        transactionId: String,
        phoneNumber: String,
        status: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema) 