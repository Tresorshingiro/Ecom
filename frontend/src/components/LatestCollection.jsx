import React, {useContext} from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
    const {products, loading, error} = useContext(ShopContext)

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error loading products: {error}</div>

    // Take only the first 10 products for latest collection
    const latestProducts = products.slice(0, 10)

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'LATEST'} text2={'COLLECTION'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Our latest collection features the newest arrivals in our store.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((item) => (
                    <ProductItem 
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        image={item.images} // Note: using images instead of image
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection
