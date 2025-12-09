import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    const { getCartAmount, delivery_fee, currency } = useContext(ShopContext)


    return (
        <div className='w-full' >
            <p className='text-sm sm:text-base text-gray-500'>{getCartAmount() < 3000 ? 'Buy Over Rs. 3000 and get 0 shipping fee' : 'You got the discount of 0 shipping fee'}</p>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTAL'} />

            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency}{' '}{getCartAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{' '}{getCartAmount() === 0 ? 0 : getCartAmount() >= 3000 ? 0 : delivery_fee}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency}{' '}{getCartAmount() === 0 ? 0 : getCartAmount() >= 3000 ? getCartAmount() : getCartAmount() + delivery_fee}</b>
                </div>

            </div>
        </div>
    )
}

export default CartTotal