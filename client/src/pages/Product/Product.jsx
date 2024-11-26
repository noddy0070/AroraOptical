import React from 'react';
import ProductDescription from './productDescription';
import CustomerReview from './CustomerReview';

export default function Product(){
    return (
        <div className='py-[4vw] mx-[2vw] font-roboto'>
            <p className='px-[4vw] mb-[1.5vw] text-[.875rem]'>Root Address</p>
            <ProductDescription/>
            <CustomerReview/>
        </div>
    );
}
