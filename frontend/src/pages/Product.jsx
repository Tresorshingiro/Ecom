import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { ShopContext } from '../context/ShopContext'
import { fetchProductById } from '../services/api'
import { toast } from 'react-toastify'

const Product = () => {
  const { productId } = useParams()
  const { currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [stockStatus, setStockStatus] = useState('available') // 'available', 'low', 'out'

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await fetchProductById(productId)
        setProductData(data)
        setImage(data.images[0]) // Note: using images instead of image
        // Set stock status
        if (data.stockQuantity <= 0) {
          setStockStatus('out')
        } else if (data.stockQuantity < 5) {
          setStockStatus('low')
        }
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size')
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}/check-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          size,
          quantity: 1
        })
      })

      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error('JSON Parse Error:', error)
        throw new Error('Failed to parse server response')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check stock')
      }

      if (!data.available) {
        toast.error('Selected quantity not available in stock')
        return
      }

      // If stock is available, add to cart
      await addToCart(productId, size)
      /*toast.success('Added to cart successfully')*/
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to add to cart')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )

  if (error) return (
    <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
      Error loading product: {error}
    </div>
  )

  if (!productData) return null

  const fullImageUrl = (imgPath) => {
    return imgPath?.startsWith('http') 
      ? imgPath 
      : `http://localhost:4000${imgPath}`
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.images.map((item, index) => (
              <img 
                onClick={() => setImage(item)} 
                src={fullImageUrl(item)} 
                key={index} 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                alt={`Product view ${index + 1}`}
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img 
              className='w-full h-auto' 
              src={fullImageUrl(image)} 
              alt={productData.name}
            />
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_icon} alt="" className='w-3 5'/>
            <img src={assets.star_dull_icon} alt="" className='w-3 5'/>
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* Stock Status */}
          {stockStatus === 'out' && (
            <p className="text-red-500 font-medium">Out of Stock</p>
          )}
          {stockStatus === 'low' && (
            <p className="text-orange-500 font-medium">Low Stock - Only {productData.stockQuantity} left</p>
          )}
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus === 'out' || !size}
            className={`bg-black text-white px-8 py-3 text-sm ${
              stockStatus === 'out' || !size ? 'opacity-50 cursor-not-allowed' : 'active:bg-gray-700'
            }`}
          >
            {stockStatus === 'out' ? 'Out of Stock' : 'ADD TO CART'}
          </button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {productData.description}
        </div>
      </div>

      <RelatedProducts 
        category={productData.category._id} 
        type={productData.type._id}
      />
    </div>
  )
}

export default Product
