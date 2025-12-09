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
            cta: "SHOP NOW",
            scrollTo: "best-sellers"
        },
        {
            title: "Latest Collection",
            subtitle: "NEW SEASON",
            image: assets.hero_img,
            cta: "EXPLORE NOW",
            scrollTo: "latest-collection"
        }
    ]
    // const handleScroll = (e) => {
    //     console.log(e.target.innerText.trim().toLowerCase());
        
    //     let value = e.target.innerText.trim().toLowerCase();
    //     if (value.includes('shop')) {
    //         window.scrollTo({
    //             top: window.scrollY + 1500, // Current position + 500px
    //             behavior: 'smooth'
    //         });
    //     } else if (value.includes('explore')) {
    //         window.scrollTo({
    //             top: window.scrollY + 650, // Current position + 500px
    //             behavior: 'smooth'
    //         });
    //     }
    // }

    const handleScroll = (e) => {
    console.log(e.target.innerText.trim().toLowerCase());
    
    let value = e.target.innerText.trim().toLowerCase();
    const isMobile = window.innerWidth < 768; // Adjust breakpoint as needed
    
    if (value.includes('shop')) {
        window.scrollTo({
            top: window.scrollY + (isMobile ? 2230 : 1500),
            behavior: 'smooth'
        });
    } else if (value.includes('explore')) {
        window.scrollTo({
            top: window.scrollY + (isMobile ? 500 : 650),
            behavior: 'smooth'
        });
    }
}


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
        <div className="relative w-full overflow-hidden max-h-screen">

            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={assets.Video} type="video/mp4" />
            </video>

            {/* Dark Overlay (optional, like Hanger Pakistan) */}
            <div className="absolute inset-0 bg-black/40 z-[1]"></div>

            {/* Slider Section */}
            <div className="relative z-5 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-20 sm:py-38">
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={index}>
                            <div className='flex flex-col sm:flex-row'>

                                {/* Left Text */}
                                <div className='w-full  flex flex-col items-center justify-center text-white py-10 sm:py-0'>


                                    <div className='flex items-center gap-2'>
                                        <p className='w-8 md:w-11 h-0.5 bg-white'></p>
                                        <p className='font-medium text-sm md:text-base'>
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    <h1 className='prata-regular text-3xl sm:py-3 lg:text-6xl leading-relaxed'>
                                        {slide.title}
                                    </h1>

                                    <div className='flex items-center gap-2 mt-2'>

                                        <button onClick={(e) => handleScroll(e)} className='font-semibold text-xs sm:text-sm  p-1 sm:p-3 bg-black/70 rounded-2xl'>
                                            {slide.cta}
                                        </button>



                                        <p className='h-px bg-white w-8 md:w-11 font-light'></p>
                                    </div>

                                </div>

                                {/* Right Image */}
                                {/* <div className='w-full sm:w-1/2 flex justify-center items-center'>
                                <img
                                    src={slide.image}
                                    className='w-full max-w-full h-64 sm:h-120 object-contain'
                                    alt=""
                                />
                            </div> */}

                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

        </div>
    );

}

export default HeroCopy