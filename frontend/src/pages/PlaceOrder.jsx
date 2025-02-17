import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/authContext'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const PlaceOrder = () => {
    const backendURL = "https://umuheto-backend.onrender.com"
    const { cartItems, getCartAmount, delivery_fee, currency } = useContext(ShopContext)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [paymentProcessing, setPaymentProcessing] = useState(false)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        state: '',
        country: '',
        zipcode: '',
        paymentMethod: 'cash' // Default to cash
    })

    const handlePayment = async (orderId) => {
        try {
            setPaymentProcessing(true);
            
            // Initiate Stripe checkout session
            const stripeResponse = await fetch(`${backendURL}/api/payments/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ orderId, items: cartItems, totalAmount: getCartAmount() + delivery_fee })
            });
    
            if (!stripeResponse.ok) {
                throw new Error('Failed to initiate Stripe payment');
            }
    
            const { sessionId, sessionUrl } = await stripeResponse.json();
    
            // Update order with Stripe session details before redirecting
            await fetch(`${backendURL}/api/order/${orderId}/update-payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    stripePaymentDetails: { sessionId, status: 'pending' }
                })
            });
    
            // Redirect to Stripe Checkout page
            window.location.href = sessionUrl;
    
        } catch (error) {
            toast.error(error.message);
        } finally {
            setPaymentProcessing(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Ensure all required fields are filled
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.city || !formData.street || !formData.state || !formData.country || !formData.zipcode) {
                throw new Error('Please fill all the required fields');
            }
    
            // Transform cartItems object into an array
            const itemsArray = Object.keys(cartItems).flatMap(itemId => {
                const sizes = cartItems[itemId];
                return Object.keys(sizes).map(size => ({
                    productId: itemId, // Ensure this matches the backend expectation
                    size: size,        // Ensure this matches the backend expectation
                    quantity: sizes[size]
                }));
            });
    
            // Place the order
            const response = await fetch(`${backendURL}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    items: itemsArray,
                    shippingDetails: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        city: formData.city,
                        street: formData.street,
                        state: formData.state,
                        country: formData.country,
                        zipCode: formData.zipcode, // Ensure this matches the backend expectation
                        paymentMethod: formData.paymentMethod
                    },
                    totalAmount: getCartAmount() + delivery_fee
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to place order');
            }
    
            const order = await response.json();
    
            if (formData.paymentMethod === 'stripe') {
                await handlePayment(order._id); // Ensure order ID is passed to Stripe payment
            } else {
                toast.success('Order placed successfully! You will pay on delivery.');
                navigate('/orders');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
            <div className='text-xl sm:text2xl my-3'>
                <Title text1={'DELIVERY'} text2={'INFORMATION'}/> 
            </div>
            <div className='flex gap-3'>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First name' value={formData.firstName} onChange={(e) => setFormData({...formData, firstName:e.target.value})}/>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last name' value={formData.lastName} onChange={(e) => setFormData({...formData, lastName:e.target.value})}/>
            </div>
            <div className='flex gap-3'>
              <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email address' value={formData.email} onChange={(e) => setFormData({...formData, email:e.target.value})}/>
              <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Street' value={formData.street} onChange={(e) => setFormData({...formData, street:e.target.value})}/> 
            </div>
            <div className='flex gap-3'>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City' value={formData.city} onChange={(e) => setFormData({...formData, city:e.target.value})}/>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State' value={formData.state} onChange={(e) => setFormData({...formData, state:e.target.value})}/>
            </div>
            <div className='flex gap-3'>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zipcode' value={formData.zipcode} onChange={(e) => setFormData({...formData, zipcode:e.target.value})}/>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country' value={formData.country} onChange={(e) => setFormData({...formData, country:e.target.value})}/>
            </div>
            <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone' value={formData.phone} onChange={(e) => setFormData({...formData, phone:e.target.value})}/>
        </div>
        {/*----right side----*/}
        <div className='mt-8'>
          <div className='mt-8 min-w-80'>
            <CartTotal/>
          </div>

            <div className='mt-12'>
                <Title text1={'PAYMENT'} text2={'METHOD'}/>
                <div className='flex gap-3 flex-col lg:flex-row'>
                    <div className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${formData.paymentMethod === 'stripe' ? 'border-green-500' : ''}`} onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}>
                        <p className={`min-w-3.5 h-3.5 border rounded-full`}></p>
                        <img src={assets.stripe_logo} alt=""/>
                    </div>
                    <div className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${formData.paymentMethod === 'cash' ? 'border-green-500' : ''}`} onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}>
                        <p className={`min-w-3.5 h-3.5 border rounded-full`}></p>
                        <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                    </div>
                </div>

                <div className='w-full text-end mt-8'>
                    <button className='bg-black text-white px-16 py-3 text-sm' onClick={handleSubmit} disabled={loading}>PLACE ORDER</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default PlaceOrder
