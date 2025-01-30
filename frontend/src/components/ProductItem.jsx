import React, {useContext} from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {
    const { currency } = useContext(ShopContext)

    // Get the first image URL from array or use single image
    const getImageUrl = () => {
        if (Array.isArray(image)) {
            // If image is an array, take the first image
            return image[0]
        } else if (typeof image === 'string') {
            // If image is a single string
            return image
        }
        return null // fallback
    }

    // Get the full image URL with backend path
    const fullImageUrl = (() => {
        const imageUrl = getImageUrl()
        if (!imageUrl) return '/placeholder-image.jpg'
        return imageUrl.startsWith('http') 
            ? imageUrl 
            : `http://localhost:4000${imageUrl}`
    })()

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img 
                    className='hover:scale-110 transition ease-in-out w-full h-64 object-cover' 
                    src={fullImageUrl} 
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = '/placeholder-image.jpg'; // Add a placeholder image
                    }}
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
