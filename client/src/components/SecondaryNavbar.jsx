import React, { useRef } from 'react';
import searchIcon from '../assets/images/searchIcon.png';
import cartIcon from '../assets/images/cartIcon.png';
import wishlistIcon from '../assets/images/wishlistIcon.png';
import profilePlaceholder from '../assets/images/profilePlaceholder.png';

export default function SecondaryNavbar () {
  const inputRef = useRef();
    return (
      <nav className="w-full bg-white sticky top-0 z-50">
        <div className="flex whitespace-nowrap flex-row gap-[2vw] px-[2vw] py-[.75vw] h-[4.5vw] justify-between items-center font-roboto text-regularText ">
              <span>Shop</span>
              <span>Men</span>
              <span>Women</span>
              <span>Brands</span>
              <span>Free Eye Test</span>
              <span>Blog</span>
              <span>About Us</span>
              <div className='ml-auto w-[15vw] flex flex-row h-[3vw] rounded-[2.5vw] border-[1px] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] '>
                <input className='focus:outline-none' type="text"
        defaultValue="What are you looking for..." // This is the initial default value
        ref={inputRef}/>
              </div>
              <img className='w-[1.75vw] h-[1.75vw]' src={wishlistIcon}/>
              <img className='w-[1.75vw] h-[1.75vw]' src={cartIcon}/>
              <img className='w-[2vw] h-[2vw]' src={profilePlaceholder}/>
              <span >
                Login/SignUp
              </span>
              
              
        </div>
      </nav>
    );
  };
  
  