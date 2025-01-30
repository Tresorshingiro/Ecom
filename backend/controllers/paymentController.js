const { requestToPay, checkPaymentStatus } = require('../utils/momoAPI')
const Order = require('../models/orderModel')

const initiatePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }

        // Format phone number (remove country code if present)
        let phoneNumber = order.shippingDetails.phone
        if (phoneNumber.startsWith('+250')) {
            phoneNumber = phoneNumber.substring(4)
        } else if (phoneNumber.startsWith('250')) {
            phoneNumber = phoneNumber.substring(3)
        }
        phoneNumber = `250${phoneNumber}`

        const paymentResult = await requestToPay(
            phoneNumber,
            order.totalAmount,
            orderId
        )

        // Update order with payment reference
        order.momoPaymentDetails = {
            transactionId: paymentResult.referenceId,
            phoneNumber: phoneNumber,
            status: paymentResult.status
        }
        await order.save()

        res.status(200).json({
            message: 'Payment initiated',
            referenceId: paymentResult.referenceId
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const checkPayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        
        if (!order || !order.momoPaymentDetails?.transactionId) {
            return res.status(404).json({ error: 'Payment not found' })
        }

        const status = await checkPaymentStatus(order.momoPaymentDetails.transactionId)
        
        // Update order payment status
        order.paymentStatus = status.toLowerCase()
        if (status === 'SUCCESSFUL') {
            order.status = 'processing'
        }
        await order.save()

        res.status(200).json({ status })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const handleCallback = async (req, res) => {
    try {
        const { referenceId, status } = req.body
        
        const order = await Order.findOne({
            'momoPaymentDetails.transactionId': referenceId
        })
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }

        order.paymentStatus = status.toLowerCase()
        if (status === 'SUCCESSFUL') {
            order.status = 'processing'
        }
        await order.save()

        res.status(200).json({ message: 'Callback processed' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    initiatePayment,
    checkPayment,
    handleCallback
} 