import React from 'react';
import Brands from './Sections/Brands';
import Categories from './Sections/Categories';
import Trending from './Sections/Trending';
import Discover from './Sections/Discover';
import HeroSection from './Sections/HeroSection';
import FreeEyeTest from './Sections/FreeEyeTest';
import Guide from './Sections/Guide';
import Blog from './Sections/Blog';
import Testimonial from './Sections/Testimonial';
import Banner from '../../components/Banner';
export default function Home() {
    return(
        <div className='relative pt-[2.25vw] overflow-hidden px-[2vw]'>
            <Banner/>
            <HeroSection/>
            <Categories/>
            <Discover/>
            <Trending/>
            <Brands/>
            <FreeEyeTest/>
            <Guide/>
            <Blog/>
            <Testimonial/>
        </div>
    )
}