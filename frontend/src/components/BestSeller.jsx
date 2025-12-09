import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const [bestseller, setBestSeller] = useState([])
    const { products } = useContext(ShopContext);

    useEffect(() => {
        if (products && products.length > 0) {
            const bestSellerProducts = products.filter(item => (item.bestseller));
            setBestSeller(bestSellerProducts.slice(0, 5));
        }
    }, [products])


    return (
        <div  className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis ea porro libero animi unde.</p>
            </div>
            {/* Rendering Products  */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
              {bestseller.map((value,index)=>(
                <ProductItem key={index} id={value._id} image={value.image} name={value.name} price={value.price}/>
              ))}
            </div>
        </div>
    )
}

export default BestSeller