import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = ({ cartItems }) => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)


    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'Totals'}/>
            </div>
            <div className='flex flex-col gap-2 mt-2  text-sm'>
                <div className='flex justify-between'>
                  <p className='text-gray-600'>Subtotal:</p>
                  <p className='font-medium'>{currency} {getCartAmount()}.00</p>
                </div>
                <hr/>
                <div className='flex justify-between'>
                  <p className='text-gray-600'>Delivery Fee:</p>
                  <p className='font-medium'>{currency} {delivery_fee}.00</p>
                </div>
                <hr/>
                <div className='flex justify-between'>
                  <p>Total:</p>
                  <p>{currency} {getCartAmount() + delivery_fee}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
