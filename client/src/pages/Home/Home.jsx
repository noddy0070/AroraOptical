import React, { Suspense, lazy } from 'react';
import HeroSection from './Sections/HeroSection';
import Categories from './Sections/Categories';

// Lazy load other sections
const Discover = lazy(() => import('./Sections/Discover'));
const Trending = lazy(() => import('./Sections/Trending'));
const Brands = lazy(() => import('./Sections/Brands'));
const FreeEyeTest = lazy(() => import('./Sections/FreeEyeTest'));
const Guide = lazy(() => import('./Sections/Guide'));
const Blog = lazy(() => import('./Sections/Blog'));
const Testimonial = lazy(() => import('./Sections/Testimonial'));

// Loading placeholder component
const SectionLoader = () => (
    <div className="w-full h-[30vw] bg-gray-100 animate-pulse rounded-lg"></div>
);

export default function Home() {
    return(
        <div className='relative bg-offwhitebg pt-[2.25vw] overflow-hidden px-[5vw] md:px-[2vw]'>
            {/* Priority sections loaded immediately */}
            <HeroSection/>
            <Categories/>
            
            {/* Lazy loaded sections */}
            <Suspense fallback={<SectionLoader />}>
                <Discover/>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
                <Trending/>
            </Suspense>
            
                <Brands/>
            
            <Suspense fallback={<SectionLoader />}>
                <FreeEyeTest />
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
                <Guide/>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
                <Blog/>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
                <Testimonial/>
            </Suspense>
        </div>
    )
}