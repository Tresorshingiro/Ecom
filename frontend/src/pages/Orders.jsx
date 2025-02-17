import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/authContext'
import Title from '../components/Title'

const Orders = () => {
  const backendURL = "https://umuheto-backend.onrender.com"
  const { currency } = useContext(ShopContext)
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendURL}/api/order`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        console.log('Order Data:', data);
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (user?.token) {
      fetchOrders()
    }
  }, [user])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )

  if (error) return (
    <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
      Error loading orders: {error}
    </div>
  )

  if (!user) return (
    <div className="text-center min-h-[400px] flex items-center justify-center">
      Please login to view your orders
    </div>
  )

  if (orders.length === 0) return (
    <div className="text-center min-h-[400px] flex items-center justify-center">
      You haven't placed any orders yet
    </div>
  )

  const getOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-500', text: 'Pending' }
      case 'processing':
        return { color: 'bg-blue-500', text: 'Processing' }
      case 'shipped':
        return { color: 'bg-green-500', text: 'Shipped' }
      case 'delivered':
        return { color: 'bg-green-700', text: 'Delivered' }
      default:
        return { color: 'bg-gray-500', text: 'Unknown' }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      <div className='space-y-6'>
      {orders.map((order) => (
      <div key={order._id} className='border rounded-lg overflow-hidden'>
       <div className='bg-gray-50 p-4 border-b'>
        <div className='flex justify-between items-center'>
        <p className='text-sm font-medium'>Order #{order._id.slice(-8)}</p>
        <p className='text-sm text-gray-600'>
          Placed on {formatDate(order.createdAt)}
        </p>
       </div>
      </div>

    {(order.items || []).map((item) => {
      const status = getOrderStatus(order.status);
      const productName = item.productId?.name || 'Product no longer available';
      const productPrice = item.productId?.price || 0;
      const productImage = item.productId?.images?.[0] 
        ? `http://localhost:4000${item.productId.images[0]}`
        : '/placeholder-image.jpg';

      return (
        <div key={`${order._id}-${item.productId?._id || 'deleted'}-${item.size}`} 
             className='py-4 px-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='flex items-start gap-6 text-sm'>
            <img 
              className='w-16 sm:w-20' 
              src={productImage} 
              alt={productName}
            />
            <div>
              <p className='sm:text-base font-medium'>{productName}</p>
              <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                <p className='text-lg'>{currency}{productPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Size: {item.size}</p>
              </div>
            </div>
          </div>
          
          <div className='md:w-1/3 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
              <p className='text-sm md:text-base'>{status.text}</p>
            </div>
            {order.status === 'shipped' && (
              <button 
                onClick={() => window.open(order.trackingUrl, '_blank')}
                className='border px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50'
              >
                Track Order
              </button>
            )}
          </div>
        </div>
      );
    })}

    <div className='bg-gray-50 p-4 flex justify-between items-center'>
      <p className='text-sm font-medium'>Total Amount:</p>
      <p className='text-lg font-medium'>{currency}{order.totalAmount}</p>
    </div>
  </div>
))}
      </div>
    </div>
  )
}

export default Orders
