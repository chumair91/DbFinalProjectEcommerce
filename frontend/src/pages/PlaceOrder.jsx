import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Select from 'react-select'
const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [loading, setLoading] = useState(false)   // 🔥 NEW

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const countries = [
    { value: 'Pakistan', label: 'Pakistan' },
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
    { value: 'Canada', label: 'Canada' },
    // add more countries
  ]
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!formData.country) {
      toast.error("Please select a country");
      return;
    }

    if (loading) return;          // 🔥 double-click prevention
    setLoading(true);             // 🔥 start loading

    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() >= 3000 ? getCartAmount() : getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod':
          const res = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });

          if (res.data.success) {
            toast.success(res.data.message)
            setCartItems({})
            navigate('/orders')
          } else {
            console.log(res.data.message);
            
            toast.error()
          }
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false);   // 🔥 stop loading
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='First name' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Last name' required />
        </div>

        <input onChange={onChangeHandler} name='email' value={formData.email} type="text" placeholder='Enter Your Email' className='border border-gray-300 w-full px-3.5 py-1.5' required />
        <input onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 w-full px-3.5 py-1.5' />

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='City' required />
          {/* <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='State' required /> */}
          <select onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 py-1.5 px-3.5 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-black" required>
            <option value="">Select State</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Kpk">Kpk</option>
            <option value="Gilgit">Gilgit</option>
          </select>
        </div>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Zip Code' required />
          {/* <input onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Country' required /> */}
          <Select
            options={countries}
            value={countries.find(c => c.value === formData.country)}
            onChange={(selectedOption) =>
              setFormData({ ...formData, country: selectedOption.value })
            }
            placeholder="Select Country"
            className="w-full"
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? 'black' : '#D1D5DB', // gray-300 when not focused
                boxShadow: state.isFocused ? '0 0 0 2px black' : 'none', // Tailwind-like ring
                borderRadius: '0.375rem', // rounded-md
                padding: '0.1rem 0.5rem',
              }),
            }}
          />


        </div>

        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 py-1.5 px-3.5 w-full' type="number" placeholder='Phone' required />

      </div>

      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'Payment'} text2={'Method'} />

          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5 mx-5' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
              <img className='h-5 mx-5' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full mt-8 text-end'>
            <button
              type='submit'
              disabled={loading}
              className={`bg-black px-8 md:px-16 py-2.5 md:py-3 text-sm text-white 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>

        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
