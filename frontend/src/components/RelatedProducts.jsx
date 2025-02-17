import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, type, productId }) => {
    const backendURL = "https://umuheto-backend.onrender.com"
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                // Fetch all products
                const response = await axios.get(`${backendURL}/api/products`)
                
                // Filter products by category and type
                const relatedProducts = response.data
                    .filter(product => 
                        product.category?._id === category && 
                        product.type?._id === type &&
                        product._id !== productId // Don't show the current product
                    )
                    .slice(0, 5) // Limit to 5 related products

                setRelated(relatedProducts)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching related products:', error)
                setError('Failed to load related products')
                setLoading(false)
            }
        }

        if (category && type) {
            fetchRelatedProducts()
        }
    }, [category, type])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                {error}
            </div>
        )
    }

    // Don't show the section if no related products
    if (related.length === 0) {
        return null
    }

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item) => (
                    <ProductItem 
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.images} // Pass the entire images array
                    />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
