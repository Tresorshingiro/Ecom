import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = ({ cartItems }) => {
    const { currency, delivery_fee } = useContext(ShopContext)
    
    const subtotal = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
    }, 0)

    const total = subtotal + delivery_fee

    return (
        <div className='border-t mt-4 pt-4'>
            <div className='flex justify-between items-center mb-2'>
                <p className='text-gray-600'>Subtotal:</p>
                <p className='font-medium'>{currency}{subtotal}</p>
            </div>
            <div className='flex justify-between items-center mb-2'>
                <p className='text-gray-600'>Delivery Fee:</p>
                <p className='font-medium'>{currency}{delivery_fee}</p>
            </div>
            <div className='flex justify-between items-center text-lg font-medium'>
                <p>Total:</p>
                <p>{currency}{total}</p>
            </div>
        </div>
    )
}

export default CartTotal
