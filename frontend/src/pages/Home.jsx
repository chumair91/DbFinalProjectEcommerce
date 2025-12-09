import React from 'react'
import Hero from '../components/Hero'
import HeroCopy from '../components/HeroCopy'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      {/* <Hero /> */}
      <HeroCopy/>
      <LatestCollection id="latest-collection"/>
       <BestSeller id='best-sellers'/>
       <OurPolicy/>
       <NewsLetterBox/>
       
    </div>
  )
}

export default Home