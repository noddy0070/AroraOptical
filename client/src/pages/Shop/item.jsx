import React from 'react';
import wishList from '../../assets/images/icons/WishlistIcon.svg'
import star from '../../assets/images/star.png'

export default function Item({comapny, price, image, rating,title,colour} ) {
    return (
        <div className='relative font-roboto shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] rounded-[1.25vw]'>
            <img src={image} alt={title} className='w-[100%] h-[17.3125vw] rounded-t-[1.25vw] mb-[.5vw]'/>
            <img src={wishList} alt='wishlist' className='absolute right-[1.25vw] top-[1.25vw] w-[1.565vw] h-auto '/>
            <div className='px-[.625vw] pb-[.5vw]'>
            <div className='flex flex-row mb-[.375vw]'>
                <p className='text-regularText font-medium'>{comapny}</p>
                <img src={star} alt='rating' className='ml-auto w-[1vw] h-[1vw  ]'/>
                <p className='text-smallText leading-[150%] ml-[2px]'>{rating}</p>
            </div>
            <h6 className='text-h6Text font-bold font-dyeLine leading-[140%]'>{title}</h6>
            <span className='text-smallText font-light leading-[150%]'>{colour}</span>
            <h6 className='text-h6Text mt-[.375vw] leading-[140%]'>{price}</h6>
            </div>
            <button className='w-full px-[.90625vw] py-[.45375vw] rounded-[1.25vw] bg-[rgba(29,50,64,.5)] '>
                <span className='text-regularText font-semibold leading-[150%]'>Add To Cart</span>
            </button>
            
        </div>
    );
};
