import React, { useRef, useState, useEffect } from 'react';
import profilePlaceholder from '../assets/images/profilePlaceholder.png';
import CartIcon from '../assets/images/icons/CartIcon.svg'
import WishListIcon from '../assets/images/icons/WishlistIcon.svg'
import SearchIcon from '../assets/images/icons/SearchIcon.svg'
import MenuIcon from "../assets/images/icons/MenuIcon.png"
import logo from '../assets/images/AroraOpticalLogo.png';
import { TransitionLink } from '../Routes/TransitionLink';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import navbarDropdown from '../assets/images/navbarDropdown.png'
export default function SecondaryNavbar() {
  const inputRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dropdownTimeoutRef = useRef(null);

  // Fetch cart count when component mounts and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartCount();
      
      const handleCartUpdate = () => {
        fetchCartCount();
      };
      
      window.addEventListener('cartUpdated', handleCartUpdate);
      
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
      };
    } else {
      setCartCount(0);
    }
  }, [user, isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/user/cart/${user._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const totalItems = response.data.cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleChange = () => {
    const value = inputRef.current.value;
    setSearch(value);
  };

  const handleDropdownEnter = (dropdownName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Small delay to prevent flickering
  };

  const renderDropdown = () => (
    <div 
      className="absolute w-screen left-[-2vw] top-full z-10 px-[6vw] bg-white border-t flex flex-row gap-[7vw] border-gray-200 shadow-lg transform opacity-100 transition-all duration-200 ease-in-out"
      onMouseEnter={() => handleDropdownEnter(activeDropdown)}
      onMouseLeave={handleDropdownLeave}
    >
      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Sunglasses</p>
        <p>New Arrivals</p>
        <p>Bestsellers</p>
        <TransitionLink to="/shop/sunglasses/women">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Women</p>
        </TransitionLink>
        <TransitionLink to="/shop/sunglasses/men">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Men</p>
        </TransitionLink>
        <TransitionLink to="/shop/sunglasses/kids">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Kids</p>
        </TransitionLink>
        <p>Polarized</p>
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Eyeglasses</p>
        <p>New Arrivals</p>
        <p>Bestsellers</p>
        <p>Women</p>
        <p>Men</p>
        <p>Kids</p>
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Contact Lenses</p>
       
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Computer Glasses</p>
        <p>New Arrivals</p>
        <p>Bestsellers</p>
        <p>Women</p>
        <p>Men</p>
        <p>Kids</p>
        <p>Polarized</p>
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Accessories</p>
        <p>Cases</p>
        <p>Travelling Kit</p>
        <p>Cleaning Cloth</p>
        <p>Lens Wipes</p>
        <p>Anti Fog Kit</p>
        <p>AO Lens Solution</p>
        <p>Lens Solution Kit</p>
      </div>
      <img className='ml-auto w-[20vw] h-auto' src={navbarDropdown} alt="Dropdown"/>
    </div>
  );

  const shopDropdown = [
    { 
      label: 'Eyeglasses', 
      to: '/shop/eyeglasses/all',
      description: 'Stylish frames for prescription lenses'
    },
    { 
      label: 'Sunglasses', 
      to: '/shop/sunglasses/all',
      description: 'Protect your eyes with trendy shades'
    },
    { 
      label: 'Contact Lenses', 
      to: '/shop/contact-lenses/all',
      description: 'Daily, monthly, and colored contacts'
    },
    { 
      label: 'Computer Glasses', 
      to: '/shop/computer-glasses/all',
      description: 'Blue light protection for digital screens'
    },
    { 
      label: 'Accessories', 
      to: '/shop/accessories/all',
      description: 'Cases, cleaners, and eyewear care'
    },
    { 
      label: 'New Arrivals', 
      to: '/shop/new-arrivals',
      description: 'Latest additions to our collection'
    },
    { 
      label: 'Best Sellers', 
      to: '/shop/best-sellers',
      description: 'Most popular frames and styles'
    },
    { 
      label: 'Sale', 
      to: '/shop/sale',
      description: 'Special offers and discounts'
    }
  ];

  <div className="
  "></div>
  return (
    <nav className="w-full bg-white relative md:sticky top-0 z-50">
      <div className="relative flex whitespace-nowrap flex-row px-[2vw] md:py-[.75vw] md:h-[4.5vw] items-center font-roboto text-regularText">
        <div className='relative flex flex-row w-full items-center gap-[2vw]'>
          <div className='flex-row hidden md:flex'>
            <div className="relative">
              <button 
                onMouseEnter={() => handleDropdownEnter('shop')}
                onMouseLeave={handleDropdownLeave}
                className="pr-[1vw] text-regularText py-[1vw] focus:outline-none hover:underline hover:text-gray-500"
              >
                Shop
              </button>
              {activeDropdown === 'shop' && renderDropdown()}
            </div>


            <button className="text-regularText px-[1vw] py-[1vw] focus:outline-none hover:underline hover:text-gray-500">
              Brands
            </button>

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
              Free Eye Test
            </button>

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
              Blog
            </button>

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
              About Us
            </button>
          </div>

          <div className='pt-[2vw] md:pt-0 md:ml-auto w-full md:w-auto gap-[2vw] md:gap-[1.5vw] flex md:flex-row flex-col-reverse items-center'>
            <div className='flex flex-row gap-[2vw] md:gap-[.5vw] ml-auto w-full md:w-[19vw] lg:w-[17.5vw] items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]'>
              <img className='w-[6vw] md:w-[1.75vw] h-[6vw] md:h-[1.75vw]' src={SearchIcon} alt="Search"/>
              <input 
                className='w-full focus:outline-none bg-transparent' 
                type="text" 
                placeholder="What are you looking for..."
                ref={inputRef} 
                onChange={handleChange}
              />
            </div>

            <div className='flex flex-row gap-[4.5vw] w-full md:w-auto md:gap-[1.5vw] items-center'>
              <img className='block md:hidden w-[8vw] h-[8vw]' src={MenuIcon} alt="Menu"/>
              <img className='block md:hidden w-[15vw] h-[10.75vw]' src={logo} alt="Logo"/>

              <img className='ml-auto w-[8vw] md:w-[1.75vw] h-[8vw] md:hidden block md:h-[1.75vw]' src={SearchIcon} alt="Search"/>
              <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={WishListIcon} alt="Wishlist"/>

              <div className="relative">
                <TransitionLink to='/cart'>
                  <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={CartIcon} alt="Cart"/>
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-[1.25vw] h-[1.25vw] flex items-center justify-center text-[0.75vw] font-bold">
                      {cartCount}
                    </div>
                  )}
                </TransitionLink>
              </div>

              {isAuthenticated ? (
                <TransitionLink to='/settings'>
                  <div className='hidden md:flex flex-row gap-[.5vw] items-center'>
                    <img className='w-[2vw] h-[2vw]' src={profilePlaceholder} alt="Profile"/>
                    <span className="text-regularText py-[.75vw] focus:outline-none hover:underline hover:text-gray-500">
                      {user?.name}
                    </span>
                  </div>
                </TransitionLink>
              ) : (
                <div className='hidden md:flex flex-row gap-[.5vw] items-center'>
                  <TransitionLink to='/login'>
                    <button className="text-regularText focus:outline-none hover:text-gray-500">Login /</button>
                  </TransitionLink>
                  <TransitionLink to='/signup'>
                    <button className="text-regularText focus:outline-none hover:text-gray-500">Sign Up</button>
                  </TransitionLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
  
  