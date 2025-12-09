import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { MdDelete, MdDeleteSweep } from 'react-icons/md'
import { LuDelete } from 'react-icons/lu'
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity,navigate } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {

    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }

    setCartData(tempData)

  }, [cartItems])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'Cart'} />
      </div>
      <div >
        {
          cartData.map((item, idx) => {
            const productData = products.find(product => product._id === item._id);
            return (
              <div key={idx} className='py-4 border-t border-b text-gray-700 items-center  grid grid-cols-[4fr_2fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-6'>
                <div className='flex items-start gap-6'>
                  <img src={productData.image[0]} className='w-16 sm:w-20' alt="" />
                  <div>
                    <p>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 '>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input type="number" min={1} defaultValue={item.quantity} onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border w-10 sm:w-16 px-1 sm:px-2 py-1 focus:scale-110' />
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer hover:scale-110 transition-all duration-200' src={assets.bin_icon} alt="" />
              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={()=>navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3 rounded-sm'>PROCEED TO CHECKOUT</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart