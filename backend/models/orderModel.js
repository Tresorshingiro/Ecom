const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            size: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    shippingDetails: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['stripe', 'cash'],
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
    stripePaymentDetails: {
        sessionId: String,
        paymentIntentId: String,
        status: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema) 