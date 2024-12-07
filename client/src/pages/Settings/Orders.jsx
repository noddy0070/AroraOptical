import React from 'react';
import DeleteIcon from '../../assets/images/icons/delete.svg';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import Star from '../../assets/images/star.png';
import Placeholder from '../../assets/images/CategoryPlaceholder.png';
import {product} from '../../data/product';


export default function Orders(){
    return (
        <>
        <div className='ml-auto w-[17.5vw] p-[.75vw] items-center flex flex-row shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] font-bold rounded-[2.5vw] '>
            <input className='text-smallText' placeholder='Search Your Wishlist'/>
            <img src={SearchIcon} className='w-[1.5vw] h-[1.5vw] ml-auto '/>
        </div>  
        {
            [1,2,3,4].map((item,index)=>
                <div key={index} className='flex flex-row font-roboto text-regularText items-center gap-[1.375vw] w-full'>
            <img className='w-[10.625vw] h-[11.1125vw] rounded-[.375vw]' src={Placeholder}/>
            <div className='flex flex-row w-[48.0625vw]'>
            <div className='flex flex-col gap-[.5vw]'>
                <h6 className='text-h6Text leading-[120%] font-bold'>Product Name</h6>
                <span className='text-smallText  leading-[150%]'>Model Number</span>
                <span className='text-smallText  leading-[150%]'>Variant . Size</span>
                <span className='text-regularText'>₹12,690.00</span>
            </div>
            <div className='ml-auto flex flex-col'>
                <p className='text-regularText leading-[150%]'>Delivery expected on 9th Sept</p>
                <a className='mt-auto ml-auto underline text-[rgba(3,9,114,1)]'><p className=''>Track Order</p> </a>
                
            </div>
            </div>
        </div>
            )
        }
        
        </>
    );
};
