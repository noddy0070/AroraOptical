import React, { useRef,useState } from 'react';
import profilePlaceholder from '../assets/images/profilePlaceholder.png';
import CartIcon from '../assets/images/icons/CartIcon.svg'
import WishListIcon from '../assets/images/icons/WishlistIcon.svg'
import SearchIcon from '../assets/images/icons/SearchIcon.svg'
import MenuIcon from "../assets/images/icons/MenuIcon.png"
import logo from '../assets/images/AroraOpticalLogo.png';
import { TransitionLink } from '../Routes/TransitionLink';
export default function SecondaryNavbar () {
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');

  const handleChange = () => {
    const value = inputRef.current.value; // Access the input value through the ref
    setSearch(value); // Update the state with the input value
    console.log(search);
  };

  const shopDropdown=[
    { label: 'Eyeglasses', to: '/shop/eyeglasses/all' },
    { label: 'Sunglasses', to: '/shop/sunglasses/all' },
    { label: 'Contact Lenses', to: '/shop/contact-lenses/all' },
    { label: 'Computer Glasses', to: '/shop/computer-glasses/all' },
    { label: 'Accessories', to: '/shop/accessories/all' },
  ];

  const menDropdown=['Category 1', 'Category 2', 'Category 3'];
  const womenDropdown=['Category 1', 'Category 2', 'Category 3'];
    return (
      <nav className="w-full  bg-white relative md:sticky top-0 z-50 ">
        <div className="flex whitespace-nowrap flex-row px-[2vw] md:py-[.75vw] md:h-[4.5vw]  items-center font-roboto text-regularText ">
        
  
        <div className=' flex flex-row w-full items-center gap-[2vw]'>
          <div className='flex-row gap-[2vw] hidden md:flex'>
            <div id="shopBtn" className="relative group">
              <button className="text-regularText py-[.75vw] focus:outline-none hover:underline hover:text-gray-500">
                Shop
              </button>
              <div className="absolute left-0 mt-[.5vw] text-black hidden w-48 bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0 text-left">
                  {shopDropdown.map((item) => (
                    <TransitionLink key={item.to} to={item.to}>
                      <li className="px-4 py-2 hover:bg-gray-100">{item.label}</li>
                    </TransitionLink>
                  ))}
                </ul>
              </div>
            </div>

            <div id="menBtn" className="relative group">
              <button className="text-regularText py-[.75vw] focus:outline-none hover:underline hover:text-gray-500">
                Men
              </button>
              <div className="absolute left-0 mt-[.5vw] text-black hidden w-48 bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0">
                  {menDropdown.map((category, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100">
                      <a href={`#category${index + 1}`}>{category}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
                          
            <div id="womenBtn" className="relative group">
              <button className="text-regularText py-[.75vw] focus:outline-none hover:underline hover:text-gray-500">
                Women
              </button>
              <div className="absolute left-0 mt-[.5vw] text-black hidden w-48 bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0">
                  {womenDropdown.map((category, index) => (
                    <li key={index} className="px-0 py-2 hover:bg-gray-100">
                      <a href={`#category${index + 1}`}>{category}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            <div id="btandbtn" className="relative group">
              <button className="text-regularText py-[.75vw] focus:outline-none hover:underline hover:text-gray-500">
                Brands
              </button>
              <div className="absolute left-0 mt-[.5vw] text-black hidden w-48 bg-white border border-gray-200 shadow-lg rounded-md group-hover:block">
                <ul className="py-0">
                  {['Category 1', 'Category 2', 'Category 3'].map((category, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100">
                      <a href={`#category${index + 1}`}>{category}</a>
                    </li>
                  ))}
                </ul>
              </div>
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
          </div>
          
          <div className='pt-[2vw] md:pt-0 md:ml-auto w-full md:w-auto gap-[2vw] md:gap-[1.5vw] flex md:flex-row flex-col-reverse items-center'>
            <div className=' flex flex-row gap-[2vw] md:gap-[.5vw] ml-auto w-full md:w-[19vw] lg:w-[17.5vw] items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]'>
              <img className='w-[6vw] md:w-[1.75vw] h-[6vw]  md:h-[1.75vw]' src={SearchIcon}/>
              <input className=' focus:outline-none ' type="text" defaultValue="What are you looking for..." ref={inputRef} onChange={handleChange} 
              onFocus={(e) => {if (e.target.value === 'What are you looking for...') {e.target.value = '';}}}
              onBlur={(e) => { if (e.target.value.trim() === '') {e.target.value = 'What are you looking for...';}}}/>
            </div>
            
            <div className='flex flex-row gap-[4.5vw] w-full md:w-auto md:gap-[1.5vw] items-center'>

             <img className='block md:hidden w-[8vw]  h-[8vw]' src={MenuIcon}/>
             <img className='block md:hidden w-[15] h-[10.75vw]' src={logo}/>    

            <img className='ml-auto w-[8vw] md:w-[1.75vw] h-[8vw] md:hidden block  md:h-[1.75vw]' src={SearchIcon}/>
              <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={WishListIcon}/>
            
              <TransitionLink to='/cart'>
                <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={CartIcon}/>
              </TransitionLink>
            
              <div className='hidden md:flex  flex-row gap-[.5vw] items-center'>
                <img className='w-[2vw] h-[2vw]' src={profilePlaceholder}/>
                <TransitionLink to='/signup'>
                  <button  className=" text-regularText focus:outline-none hover:text-gray-500"> Login/Sign Up </button>
                </TransitionLink>
                </div>
            </div>
          </div>
              
        </div>
        </div>
      </nav>
    );
  };
  
  