import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/authContext'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const PlaceOrder = () => {
    const { cartItems, getCartAmount, delivery_fee, currency } = useContext(ShopContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'momo' // Default to Mobile Money
    })
    const [paymentProcessing, setPaymentProcessing] = useState(false)

    const handlePayment = async (orderId) => {
        try {
            setPaymentProcessing(true)
            // Initiate MOMO payment
            const response = await fetch(`http://localhost:4000/api/payments/momo/initiate/${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            
            if (!response.ok) {
                throw new Error('Failed to initiate payment')
            }

            const { referenceId } = await response.json()
            
            // Start polling for payment status
            const checkStatus = async () => {
                const statusResponse = await fetch(`http://localhost:4000/api/payments/momo/status/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                const { status } = await statusResponse.json()
                
                if (status === 'SUCCESSFUL') {
                    toast.success('Payment successful!')
                    navigate('/orders')
                } else if (status === 'FAILED') {
                    toast.error('Payment failed')
                } else if (status === 'PENDING') {
                    // Continue polling
                    setTimeout(checkStatus, 5000)
                }
            }

            // Start checking status after 5 seconds
            setTimeout(checkStatus, 5000)
            
            toast.info('Please check your phone to complete the payment')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setPaymentProcessing(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate phone number for MTN MOMO
            if (formData.paymentMethod === 'momo') {
                const momoRegex = /^(?:25)?07[238]\d{7}$/
                if (!momoRegex.test(formData.phone)) {
                    toast.error('Please enter a valid MTN phone number')
                    setLoading(false)
                    return
                }
            }

            // Check stock availability
            for (const [productId, sizes] of Object.entries(cartItems)) {
                for (const [size, quantity] of Object.entries(sizes)) {
                    const response = await fetch(`http://localhost:4000/api/products/${productId}/check-stock`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        },
                        body: JSON.stringify({ size, quantity })
                    })
                    const { available } = await response.json()
                    if (!available) {
                        toast.error('Some items in your cart are no longer available')
                        return
                    }
                }
            }

            // Place the order
            const response = await fetch('http://localhost:4000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    items: cartItems,
                    shippingDetails: formData,
                    totalAmount: getCartAmount() + delivery_fee
                })
            })

            if (!response.ok) {
                throw new Error('Failed to place order')
            }

            const order = await response.json()

            if (formData.paymentMethod === 'momo') {
                await handlePayment(order._id)
            } else {
                // Cash on delivery
                toast.success('Order placed successfully!')
                navigate('/orders')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <div className="mb-8">
                <Title text1="CHECKOUT" text2="DETAILS" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number (MTN)</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="07X XXX XXXX"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City/District</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 border rounded-md bg-yellow-50">
                            <input
                                type="radio"
                                id="momo"
                                name="paymentMethod"
                                value="momo"
                                checked={formData.paymentMethod === 'momo'}
                                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                className="h-4 w-4 text-yellow-600"
                            />
                            <label htmlFor="momo" className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">MTN Mobile Money</span>
                                <img src={assets.momo_logo} alt="MTN MOMO" className="h-8" />
                            </label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-md">
                            <input
                                type="radio"
                                id="cash"
                                name="paymentMethod"
                                value="cash"
                                checked={formData.paymentMethod === 'cash'}
                                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                className="h-4 w-4"
                            />
                            <label htmlFor="cash" className="text-gray-900">Cash on Delivery</label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{currency}{getCartAmount()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>{currency}{delivery_fee}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between font-medium text-lg">
                            <span>Total</span>
                            <span>{currency}{getCartAmount() + delivery_fee}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : `Pay ${currency}${getCartAmount() + delivery_fee}`}
                </button>
            </form>
        </div>
    )
}

export default PlaceOrder
