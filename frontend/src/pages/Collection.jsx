import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }




  const applyFilter = () => {
    let productCopy = products.slice();
    if (search && showSearch) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productCopy = productCopy.filter(items => category.includes(items.category))
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter(items => subCategory.includes(items.subCategory))
    }
    setFilterProducts(productCopy);
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, products,search,showSearch])

  useEffect(() => {
    setFilterProducts(products);
  }, [products])

  useEffect(() => {
    sortProducts();
  }, [sortType])



  const sortProducts = () => {
    let sortCopy = [...filterProducts];
    if (sortType === 'low-high') {
      setFilterProducts(sortCopy.sort((a, b) => a.price - b.price));
    } else if (sortType === 'high-low') {
      setFilterProducts(sortCopy.sort((a, b) => b.price - a.price));
    }
  }



  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter  */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''} `} alt="" />
        </p>
        {/* Category Filter  */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Men"} id='Men' onChange={toggleCategory} className='w-3' />
              <label htmlFor="Men">Men</label>
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Women"} id='Women' onChange={toggleCategory} className='w-3' />
              <label htmlFor="Women">Women</label>
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Kids"} id='Kids' onChange={toggleCategory} className='w-3' />
              <label htmlFor="Kids">Kids</label>
            </p>
          </div>
        </div>
        {/* SubCategory Filter  */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>SUB CATEGORY FILTER</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Topwear"} onChange={toggleSubCategory} id='Topwear' className='w-3' />
              <label htmlFor="Topwear">Topwear</label>
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Bottomwear"} onChange={toggleSubCategory} id='Bottomwear' className='w-3' />
              <label htmlFor="Bottomwear">Bottomwear</label>
            </p>
            <p className='flex gap-2'>
              <input type="checkbox" value={"Winterwear"} onChange={toggleSubCategory} id='Winterwear' className='w-3' />
              <label htmlFor="Winterwear">Winterwear</label>
            </p>
          </div>
        </div>


      </div>
      {/* Right side  */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:test-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'} />
          {/* Product sort  */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-200 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: low to high</option>
            <option value="high-low">Sort by: high to low</option>
          </select>
        </div>
        {/* Products mapping  */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 '>
          {
            filterProducts.map((item, idx) => (
              <ProductItem key={idx} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Collection