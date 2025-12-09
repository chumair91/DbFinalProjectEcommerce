import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from './ProductItem'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext)
    const [related, setRelated] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = [...products]


            productsCopy = productsCopy.filter(item => item.category === category && item.subCategory === subCategory)

            setRelated(productsCopy)
        } 
    }, [products])

    const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: true,

    responsive: [
        {
            breakpoint: 1280,
            settings: { slidesToShow: 4 }
        },
        {
            breakpoint: 1024,
            settings: { slidesToShow: 3 }
        },
        {
            breakpoint: 640,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 480,
            settings: { slidesToShow: 1 }
        }
    ]
};

    return (
        <div className='my-24'>
            <div className='text-center text-4xl'>
                <Title text1={'Related'} text2={'Products'} />
            </div>
            <Slider {...settings}>
                {/* <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'> */}
                    {related.map((item) => (
                        <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))}
                {/* </div> */}
            </Slider>


        </div>
    )
}

export default RelatedProducts