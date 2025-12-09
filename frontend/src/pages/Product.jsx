import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams()
  const { products, currency,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const fetchProductData = async () => {
    if (productId && products.length > 0) {
      const product = products.find(item => item._id === productId)
      setProductData(product || null)
      setImage(product.image[0])
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  if (!productData) {
    return <div>Loading...</div>
  }
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data  */}
      <div className='flex gap-12 sm:gap-18 flex-col sm:flex-row'>
        {/* product img  */}
        <div className='flex-1 flex flex-col-reverse gap-5 sm:flex-row mr-6'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll  justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, idx) => (
                <img src={item} onClick={() => setImage(item)} key={idx} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto object-contain' src={image} alt="" />
          </div>
        </div>
        {/*  Product Info  */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'> {productData.name} </h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}.{productData.price}</p>
          <p className='mt-5 text-gray-600 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, idx) => (
                <button key={idx} onClick={() => setSize(item)} className={`py-1 px-2 sm:py-2 sm:px-4 bg-gray-100 ${item === size ? 'border border-orange-400' : ''}`}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>{
            addToCart(productData._id,size),
            setSize('')
          }} className='bg-black text-white py-2 px-4 sm:px-5 sm:py-3 active:bg-black/70 transition-all duration-200 group rounded-sm'><span className='inline-block group-hover:scale-110 group-hover:text-yellow-500 group-active:text-xs transition-all duration-200 '>ADD TO CART</span></button>
          <hr className='mt-8 sm:w-4/5 text-gray-400 h-1' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and review section  */}
      <div className='mt-20'>
        <div className='flex '>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm' >Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
          <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div>

      {/* Related Products  */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product