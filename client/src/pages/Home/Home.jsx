import React from 'react';
import Brands from './Sections/Brands';
import Categories from './Sections/Categories';
import Trending from './Sections/Trending';
export default function Home() {
    return(
        <div className='px-[2vw]'>
            <Categories/>
            <Trending/>
            <Brands/>
        </div>
    )
}