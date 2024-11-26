import React, { useState, useEffect } from 'react';
import placeholder from '../../assets/images/CategoryPlaceholder.png';
import productPlaceholder from '../../assets/images/productPlaceholder.png';
import { IconButton } from '../../components/button';
import Item from './item';
export default function Shop() {
    
    return (
    <div className='mx-[2vw] '>
        <div className='relative'>
        <img src={placeholder} className='relative rounded-[1.875vw] hide-scrollbar w-full h-[25.25vw]'></img>
        <IconButton className='absolute right-[4vw] top-[3vw]'  btnSize={3.0625} padding={.85} iconWidth={2.1875}/>
        </div>
        <h3 className='text-h3Text font-dyeLine font-bold leading-[120%] text-center py-[4vw]'>Sunglasses for Men</h3>
        <div className='w-[22.875vw] mb-[2vw]'>
        <Item image={productPlaceholder} comapny={"RayBan"} rating={"3.5 • 10"} title={"Junior new wayfarer"} price={"₹12,690.00"} colour={"100/71 - Black"} />
         
        </div>
    </div>    
    );
};
