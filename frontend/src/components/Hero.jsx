import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCopy = () => {
    const slides = [
        {
            title: "Latest Arrivals",
            subtitle: "OUR BESTSELLERS",
            image: assets.ChahatImg,
            cta: "SHOP NOW"
        },
        {
            title: "Summer Collection",
            subtitle: "NEW SEASON", 
            image: assets.hero_img,
            cta: "EXPLORE NOW"
        }
    ]
    
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    }

    return (
        <div className='border border-gray-400'> {/* Move border here */}
    
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    // Remove flex classes from this div - Slider adds its own wrapper
                    <div key={index}>
                        {/* This div should have the flex layout */}
                        <div className='flex flex-col sm:flex-row'>
                            {/* Hero Left */}
                            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                            
                                <div className='text-[#414141]'>
                                    <div className='flex items-center gap-2'>
                                        <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
                                        <p className='font-medium text-sm md:text-base'>{slide.subtitle}</p>
                                    </div>
                                    <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
                                        {slide.title}
                                    </h1>
                                    <div className='flex items-center gap-2'>
                                        <p className='font-semibold text-sm md:text-base'>{slide.cta}</p>
                                        <p className='h-[1px] bg-[#414141] w-8 md:w-11 font-light'></p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hero Right */}
                            <div className='w-full sm:w-1/2 flex justify-center items-center'>
                                <img
                                    src={slide.image}
                                    className='w-full max-w-full h-64 sm:h-120 object-contain'
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default HeroCopy