import React from 'react';
import ProductDescription from './productDescription';

export default function Product(){
    return (
        <div className='py-[4vw] mx-[2vw] font-roboto'>
            <p className='px-[4vw] mb-[1.5vw] text-[.875rem]'>Root Address</p>
            <ProductDescription/>
        </div>
    );
};
