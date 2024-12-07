import React from 'react';
import DeleteIcon from '../../assets/images/icons/delete.svg';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import Star from '../../assets/images/star.png';
import {product} from '../../data/product';

export default function WishList(){
    return (
        <>
        <div className='ml-auto w-[17.5vw] p-[.75vw] items-center flex flex-row shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] font-bold rounded-[2.5vw] '>
            <input className='text-smallText' placeholder='Search Your Wishlist'/>
            <img src={SearchIcon} className='w-[1.5vw] h-[1.5vw] ml-auto '/>
        </div>  
        {
            product.map((item,index)=>
                <div key={index} className='flex flex-row font-roboto text-regularText gap-[1.375vw] w-full'>
            <img className='w-[10.625vw] h-[11.1125vw] rounded-[.375vw]' src={item.image[0]}/>
            <div className='py-[1.15625vw] px-[0.625vw] flex flex-col gap-[.375vw]'>
                <span className=' font-medium'>{item.comapny}</span>
                <div>
                    <h6 className='font-dyeLine text-h6Text font-bold leading-[140%]'>{item.title}</h6>
                    <span className='text-smallText font-light leading-[150%]'>{item.colour}</span>
                </div>
                <div className='flex flex-row'>
                    <img src={Star} alt='rating' className='w-[1vw] h-[1vw]'/>
                    <p className='text-smallText leading-[150%] ml-[2px]'>{item.rating}</p>
                </div>
                <span className='text-h6Text'>{item.price}</span>
            </div>
            <img src={DeleteIcon} className='w-[1.5vw] h-[1.5vw] ml-auto'/>
        </div>
            )
        }
        
        </>
    );
};
