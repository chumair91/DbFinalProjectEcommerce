import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
    return (
        <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
            <div className='flex flex-col'>
               <img className='w-12 m-auto mb-5' src={assets.exchange_icon} alt="" />
               <h3 className='font-semibold text-[18px] text-center'>Easy Exchange Policy</h3>
               <p className='text-xs sm:text-sm md:text-base font-medium  text-gray-400'>We offer hassle free exchange policy</p>
            </div>
            <div className='flex flex-col'>
               <img className='w-12 m-auto mb-5' src={assets.quality_icon} alt="" />
               <h3 className='font-semibold text-[18px] text-center'>7 Days Return Policy</h3>
               <p className='text-xs sm:text-sm md:text-base font-medium  text-gray-400'>We provide 7 days free return policy</p>
            </div>
            <div className='flex flex-col'>
               <img className='w-12 m-auto mb-5' src={assets.support_img} alt="" />
               <h3 className='font-semibold text-[18px] text-center'>Best customer support</h3>
               <p className='text-xs sm:text-sm md:text-base font-medium  text-gray-400'>we provide 24/7 customer support</p>
            </div>
         
        </div>
    )
}

export default OurPolicy