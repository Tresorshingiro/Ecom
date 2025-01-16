import React, {useContext} from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id, image, name, price}) => {
    const { currency } = useContext(ShopContext)

    // Get the image URL, handling both array and string formats
    const imageUrl = Array.isArray(image) ? image[0] : image;
    
    // Add base URL for backend images if needed
    const fullImageUrl = imageUrl?.startsWith('http') 
        ? imageUrl 
        : `http://localhost:4000${imageUrl}`;

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img 
                    className='hover:scale-110 transition ease-in-out' 
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
