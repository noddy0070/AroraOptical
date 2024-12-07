import React, { useRef,useState } from 'react';
import profilePlaceholder from '../assets/images/profilePlaceholder.png';
import CartIcon from '../assets/images/icons/CartIcon.svg'
import WishListIcon from '../assets/images/icons/WishlistIcon.svg'
import SearchIcon from '../assets/images/icons/SearchIcon.svg'
export default function SecondaryNavbar () {
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');

  const handleChange = () => {
    const value = inputRef.current.value; // Access the input value through the ref
    setSearch(value); // Update the state with the input value
    console.log(search);
  };
    return (
      <nav className="w-full bg-white sticky top-0 z-50">
        <div className="flex whitespace-nowrap flex-row px-[2vw] py-[.75vw] h-[4.5vw]  items-center font-roboto text-regularText ">
        <div className="relative flex flex-row gap-[2vw]  w-min ">
          
            
            
          </div>
  
        <div className=' flex flex-row w-full items-center gap-[2vw]'>
        <div id='shopBtn'>
              <button className="relative text-regularText group py-[.75vw]  focus:outline-none hover:underline hover:text-gray-500">
                Shop
                <div className="absolute left-0 mt-[.5vw] text-black hidden w-48   bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0 p">
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category1">Category 1</a>
                  </li>
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category2">Category 2</a>
                  </li>
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category3">Category 3</a>
                  </li>
                </ul>
              </div>
              </button>
              
            </div>

            <div id='menBtn'>
              <button className="relative text-regularText group py-[.75vw]  focus:outline-none hover:underline hover:text-gray-500">
                Men
                <div className="absolute left-0 mt-[.5vw] text-black hidden w-48   bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category1">Category 1</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category2">Category 2</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category3">Category 3</a>
                  </li>
                </ul>
              </div>
              </button>
              
            </div>
            <div id='shopBtn'>
              <button className="relative text-regularText group py-[.75vw]  focus:outline-none hover:underline hover:text-gray-500">
                Women
                <div className="absolute left-0 mt-[.5vw] text-black hidden w-48   bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0 p">
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category1">Category 1</a>
                  </li>
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category2">Category 2</a>
                  </li>
                  <li className="px-0 py-2 hover:bg-gray-100">
                    <a href="#category3">Category 3</a>
                  </li>
                </ul>
              </div>
              </button>
              
            </div>

            <div id='menBtn'>
              <button className="relative text-regularText group py-[.75vw]  focus:outline-none hover:underline hover:text-gray-500">
                Brands
                <div className="absolute left-0 mt-[.5vw] text-black hidden w-48   bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category1">Category 1</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category2">Category 2</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#category3">Category 3</a>
                  </li>
                </ul>
              </div>
              </button>
              
            </div>
        <button  className="text-regularText focus:outline-none hover:text-gray-500">
          Free Eye Test
        </button>
        <button  className="text-regularText focus:outline-none hover:text-gray-500">
          Blog
        </button>
        <button  className="text-regularText focus:outline-none hover:text-gray-500">
          About Us
        </button>
              <div className=' flex flex-row gap-[.5vw] ml-auto md:w-[19vw] lg:w-[17.5vw] items-center text-gray-600 font-roboto font-bold text-smallText h-[3vw] px-[.75vw] rounded-[2.5vw] border-[1px] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] '>
              <img className='w-[1.75vw] h-[1.75vw]' src={SearchIcon}/>
                <input className='focus:outline-none ' type="text"
        defaultValue="What are you looking for..." // This is the initial default value
        ref={inputRef}
        onChange={handleChange}
        onFocus={(e) => {
          if (e.target.value === 'What are you looking for...') {
            e.target.value = '';
          }
        }}
        onBlur={(e) => {
          if (e.target.value.trim() === '') {
            e.target.value = 'What are you looking for...';
          }
        }}/>
              </div>
        <img className='w-[1.75vw] h-[1.75vw]' src={WishListIcon}/>
        <img className='w-[1.75vw] h-[1.75vw]' src={CartIcon}/>
        <div className='flex flex-row gap-[.5vw]'>
          <img className='w-[2vw] h-[2vw]' src={profilePlaceholder}/>
          <button  className=" text-regularText focus:outline-none hover:text-gray-500"> Login/Sign Up </button>
        </div>
              
        </div>
        </div>
      </nav>
    );
  };
  
  