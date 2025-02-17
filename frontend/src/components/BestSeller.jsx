import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const backendURL = "https://umuheto-backend.onrender.com";
    console.log("Backend URL:", backendURL);
    const [bestSellers, setBestSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/products`)
                // Filter products where bestSeller is true and limit to 5 items
                const bestSellerProducts = response.data
                    .filter(product => product.bestSeller === true)
                    .slice(0, 5)
                setBestSellers(bestSellerProducts)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching best sellers:', error)
                setError('Failed to load best sellers')
                setLoading(false)
            }
        }

        fetchBestSellers()
    }, [])

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

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus iusto eos veniam hic ipsam, deleniti autem!
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSellers.map((item) => (
                    <ProductItem 
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        image={item.images}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}

export default BestSeller
