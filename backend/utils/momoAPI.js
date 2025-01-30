const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

// Replace these with your actual MTN MOMO API credentials
const config = {
    baseURL: process.env.MOMO_API_URL,
    subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY,
    targetEnvironment: process.env.MOMO_TARGET_ENVIRONMENT,
    apiKey: process.env.MOMO_API_KEY,
    callbackUrl: process.env.MOMO_CALLBACK_URL
}

const generateToken = async () => {
    try {
        const auth = Buffer.from(`${config.apiKey}:`).toString('base64')
        const response = await axios({
            method: 'post',
            url: `${config.baseURL}/collection/token/`,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Ocp-Apim-Subscription-Key': config.subscriptionKey
            }
        })
        return response.data.access_token
    } catch (error) {
        console.error('Error generating token:', error)
        throw error
    }
}

const requestToPay = async (phoneNumber, amount, orderId) => {
    try {
        const token = await generateToken()
        const referenceId = uuidv4()
        
        const response = await axios({
            method: 'post',
            url: `${config.baseURL}/collection/v1_0/requesttopay`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Reference-Id': referenceId,
                'X-Target-Environment': config.targetEnvironment,
                'Ocp-Apim-Subscription-Key': config.subscriptionKey,
                'Content-Type': 'application/json'
            },
            data: {
                amount: amount.toString(),
                currency: "EUR",
                externalId: orderId,
                payer: {
                    partyIdType: "MSISDN",
                    partyId: phoneNumber
                },
                payerMessage: "Payment for order",
                payeeNote: "Order payment"
            }
        })

        return {
            referenceId,
            status: response.status === 202 ? 'pending' : 'failed'
        }
    } catch (error) {
        console.error('Error requesting payment:', error)
        throw error
    }
}

const checkPaymentStatus = async (referenceId) => {
    try {
        const token = await generateToken()
        
        const response = await axios({
            method: 'get',
            url: `${config.baseURL}/collection/v1_0/requesttopay/${referenceId}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Target-Environment': config.targetEnvironment,
                'Ocp-Apim-Subscription-Key': config.subscriptionKey
            }
        })

        return response.data.status
    } catch (error) {
        console.error('Error checking payment status:', error)
        throw error
    }
}

module.exports = {
    requestToPay,
    checkPaymentStatus
} 