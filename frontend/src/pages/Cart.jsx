import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const backendURL = "https://umuheto-backend.onrender.com"
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = products.find(p => p._id === productId);
            if (product) {
              tempData.push({
                _id: productId,
                size: size,
                quantity: cartItems[productId][size],
                product: product
              });
            }
          }
        }
      }
      setCartData(tempData);
      setLoading(false);
    }
  }, [cartItems, products]);

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className='border-t pt-14'>
        <div className='text-2xl mb-3'>
          <Title text1={'YOUR'} text2={'CART'} />
        </div>
        <div className="text-center py-10">
          Your cart is empty
        </div>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${backendURL}${imagePath}`;
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item) => (
          <div 
            key={`${item._id}-${item.size}`} 
            className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
          >
            <div className='flex items-start gap-6'>
              <img 
                className='w-16 sm:w-20' 
                src={getImageUrl(item.product.images[0])} 
                alt={item.product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <div>
                <p className='sm:text-base font-medium'>{item.product.name}</p>
                <div className='flex items-center gap-5 mt-2 text-base text-gray-700'>
                  <p className='text-lg'>{currency}{item.product.price}</p>
                  <p>Size: {item.size}</p>
                </div>
              </div>
            </div>

            <input 
              type='number'
              min={1}
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  updateQuantity(item._id, item.size, value);
                }
              }}
              className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
            />

            <button
              onClick={() => updateQuantity(item._id, item.size, 0)}
              className='flex items-center justify-center'
            >
              <img 
                className='w-4 mr-4 sm:w-5 cursor-pointer' 
                src={assets.bin_icon} 
                alt='Remove item'
              />
            </button>
          </div>
        ))}
      </div>
     
      <CartTotal cartItems={cartData} />

      <div className='flex justify-end mt-8'>
        <button
          onClick={() => navigate('/place-order')}
          className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  )
}

export default Cart
