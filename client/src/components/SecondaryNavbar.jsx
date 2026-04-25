import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import navbarDropdown from '../assets/images/navbarDropDown.png'
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Eye, 
  Glasses  
} from "lucide-react";

export default function SecondaryNavbar() {
  const inputRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dropdownTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [openSunglasses, setOpenSunglasses] = useState(false);
  const [openEyeglasses, setOpenEyeglasses] = useState(false);

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

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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

  // Debounced search function
  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${baseURL}/api/product/search`, {
        params: { q: searchTerm, limit: 8 },
        withCredentials: true
      });


      if (response.data.success) {
        setSearchResults(response.data.products);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Navbar search error:', error);
      console.error('Navbar search error response:', error.response?.data);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = () => {
    const value = inputRef.current.value;
    setSearch(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce
  };

  // Handle search result click
  const handleSearchResultClick = (product) => {
    setShowSearchResults(false);
    setSearch('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    navigate(`/product/${product._id}`);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  // Handle Enter key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (search.trim().length > 0) {
        navigate(`/search?q=${encodeURIComponent(search.trim())}`);
        setShowSearchResults(false);
        setSearch('');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
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
        <TransitionLink to="/shop/sunglasses/new-arrivals">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">New Arrivals</p>
        </TransitionLink>
        <TransitionLink to="/shop/sunglasses/bestsellers">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">Bestsellers</p>
        </TransitionLink>
        <TransitionLink to="/shop/sunglasses/women">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">Women</p>
        </TransitionLink>     
        <TransitionLink to="/shop/sunglasses/men">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">Men</p>
        </TransitionLink>
        <TransitionLink to="/shop/sunglasses/kids">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">Kids</p>
        </TransitionLink>
        <p>Polarized</p>
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Eyeglasses</p>
        <TransitionLink to="/shop/eyeglasses/new-arrivals">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">New Arrivals</p>
        </TransitionLink>
        <TransitionLink to="/shop/eyeglasses/bestsellers">
          <p onClick={()=>setActiveDropdown(null)} className="hover:text-black transition-colors duration-200 cursor-pointer">Bestsellers</p>
        </TransitionLink>
        <TransitionLink onClick={()=>setActiveDropdown(null)} to="/shop/eyeglasses/women">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Women</p>
        </TransitionLink>
        <TransitionLink onClick={()=>setActiveDropdown(null)} to="/shop/eyeglasses/men">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Men</p>
        </TransitionLink>
        <TransitionLink onClick={()=>setActiveDropdown(null)} to="/shop/eyeglasses/kids">
          <p className="hover:text-black transition-colors duration-200 cursor-pointer">Kids</p>
        </TransitionLink>
      </div>

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <p className='text-black mb-[.625vw]'>Contact Lenses</p>
        <p className="hover:text-black transition-colors duration-200 cursor-pointer">Bauch and lomb </p>
        <p className="hover:text-black transition-colors duration-200 cursor-pointer">Cooper Vision</p>
        <p className="hover:text-black transition-colors duration-200 cursor-pointer">Johnson & Johnson</p>
        <p className="hover:text-black transition-colors duration-200 cursor-pointer">Silklens</p>
        <p className="hover:text-black transition-colors duration-200 cursor-pointer">Purecon</p>
       
      </div>

      

      <div className='mt-[3vw] text-regularText font-roboto text-[#737373] font-bold flex flex-col gap-[.625vw]'>
        <TransitionLink to="/accessories">
        <p className='text-black mb-[.625vw]'>Accessories</p>
        </TransitionLink>
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
    <nav className="w-full bg-offwhitebg relative md:sticky top-0 z-50">
      <div className="relative flex whitespace-nowrap flex-row px-[2vw] md:py-[.75vw] md:h-[4.5vw] items-center font-roboto text-regularText">
        <div className='relative flex flex-row w-full items-center gap-[2vw]'>
          <div className='flex-row hidden md:flex font-bold'>
            <div className="relative">
              <TransitionLink to="/shop/sunglasses/new-arrivals">
              <button 
                onMouseEnter={() => handleDropdownEnter('shop')}
                onMouseLeave={handleDropdownLeave}
                className="pr-[1vw] text-regularText py-[1vw] focus:outline-none hover:underline hover:text-gray-500"
              >

                Shop
              </button>
              </TransitionLink>
              {/* Uncomment this when you want to show the dropdown */}
              {activeDropdown === 'shop' && renderDropdown()}
            </div>


            {/* <button className="text-regularText px-[1vw] py-[1vw] focus:outline-none hover:underline hover:text-gray-500">
              Smart Glasses
            </button> */}

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
            <TransitionLink to="/eye-test">
              Free Eye Test
              </TransitionLink>

            </button>

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
              Blog
            </button>

            <button className="text-regularText px-[1vw] focus:outline-none hover:text-gray-500">
            <TransitionLink to="/about-us">
              About Us
            </TransitionLink>
            </button>
          </div>

          <div className='pt-[2vw] md:pt-0 md:ml-auto w-full md:w-auto gap-[2vw] md:gap-[1.5vw] flex md:flex-row flex-col-reverse items-center'>
            <div className='relative flex flex-row gap-[2vw] md:gap-[.5vw] ml-auto w-full md:w-[19vw] lg:w-[17.5vw] items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]'>
              <img className='w-[6vw] md:w-[1.75vw] h-[6vw] md:h-[1.75vw]' src={SearchIcon} alt="Search"/>
              <input 
                className='w-full focus:outline-none bg-transparent' 
                type="text" 
                placeholder="What are you looking for..."
                ref={inputRef} 
                onChange={handleChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyPress={handleSearchKeyPress}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[1vw] md:rounded-[0.5vw] shadow-lg z-50 max-h-[60vw] md:max-h-[20vw] overflow-y-auto'>
                  {isSearching ? (
                    <div className='p-[3vw] md:p-[1vw] text-center text-gray-500'>
                      <div className='animate-spin w-[4vw] h-[4vw] md:w-[1vw] md:h-[1vw] border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-[1vw]'></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleSearchResultClick(product)}
                          className='p-[3vw] md:p-[1vw] hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                        >
                          <div className='flex items-center gap-[2vw] md:gap-[0.5vw]'>
                            <img 
                              src={product.images[0]} 
                              alt={product.modelTitle}
                              className='w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] object-cover rounded-[0.5vw]'
                            />
                            <div className='flex-1 min-w-0'>
                              <h6 className='text-[3vw] md:text-[0.8vw] font-semibold text-gray-800 truncate'>
                                {product.modelTitle}
                              </h6>
                              <p className='text-[2.5vw] md:text-[0.7vw] text-gray-600 truncate'>
                                {product.brand} • {product.modelName}
                              </p>
                              <p className='text-[2.5vw] md:text-[0.7vw] text-blue-600 font-semibold'>
                                ₹{product.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className='p-[3vw] md:p-[1vw] text-center border-t border-gray-200'>
                        <button 
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                            setShowSearchResults(false);
                          }}
                          className='text-blue-600 text-[2.5vw] md:text-[0.7vw] font-semibold hover:text-blue-800'
                        >
                          View all results for "{search}"
                        </button>
                      </div>
                    </>
                  ) : search.trim().length >= 2 ? (
                    <div className='p-[3vw] md:p-[1vw] text-center text-gray-500'>
                      No products found for "{search}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className='flex flex-row gap-[4.5vw] w-full md:w-auto md:gap-[1.5vw] items-center'>
              <button onClick={() => setIsMobileMenuOpen(true)} className='block md:hidden'>
                <img className='w-[8vw] h-[8vw]' src={MenuIcon} alt="Menu"/>
              </button>
              <TransitionLink to='/' className=''>
                <img className='w-[15vw] h-[10.75vw] block md:hidden' src={logo} alt="Logo"/>
              </TransitionLink>

              <img className='ml-auto w-[8vw] md:w-[1.75vw] h-[8vw] md:hidden block md:h-[1.75vw]' src={SearchIcon} alt="Search"/>
              <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={WishListIcon} alt="Wishlist"/>

              <div className="relative">
                <TransitionLink to='/cart'>
                  <img className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' src={CartIcon} alt="Cart"/>
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-[4.5vw] h-[4.5vw] md:w-[1.25vw] md:h-[1.25vw] flex items-center justify-center text-smallTextPhone md:text-smallText leading-[0%] font-bold">
                      {cartCount}
                    </div>
                  )}
                </TransitionLink>
              </div>

              {isAuthenticated ? (
                <TransitionLink to='/settings'>
                  <div className='hidden md:flex flex-row gap-[.5vw] items-center'>
                    {/* <img className='w-[2vw] h-[2vw]' src={profilePlaceholder} alt="Profile"/> */}
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

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className='fixed top-0 left-0 h-full w-[80vw] max-w-[400px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto'>
            <div className='flex flex-col h-full'>
              {/* Header */}
              <div className='flex items-center justify-between p-[5vw] border-b border-gray-200'>
                <TransitionLink to='/' onClick={() => setIsMobileMenuOpen(false)}>
                  <img className='w-[30vw] h-[21.5vw]' src={logo} alt="Logo"/>
                </TransitionLink>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='w-[8vw] h-[8vw] flex items-center justify-center'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[6vw] h-[6vw]">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col p-[5vw] gap-[5vw]">

      {/* SHOP HEADER */}
      <div className="flex items-center gap-[2vw] border-b border-gray-200 pb-[2vw]">
        <ShoppingBag size={18} />
        <h3 className="text-regularTextPhone font-bold">Shop</h3>
      </div>

      {/* ------------------- SUNGLASSES DROPDOWN ------------------- */}
      <div className="flex flex-col">
        <button 
          onClick={() => setOpenSunglasses(!openSunglasses)}
          className="flex items-center justify-between text-regularTextPhone font-semibold py-[2vw]"
        >
          <div className="flex items-center gap-[2vw]">
            <Glasses size={16} />
            <span>Sunglasses</span>
          </div>

          {openSunglasses ? <ChevronUp size={16}/> : <ChevronDown size={16} />}
        </button>

        {openSunglasses && (
          <div className="flex flex-col gap-[1.5vw] pl-[6vw]">
            <TransitionLink to="/shop/sunglasses/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">New Arrivals</p>
            </TransitionLink>

            <TransitionLink to="/shop/sunglasses/bestsellers" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Bestsellers</p>
            </TransitionLink>

            <TransitionLink to="/shop/sunglasses/women" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Women</p>
            </TransitionLink>

            <TransitionLink to="/shop/sunglasses/men" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Men</p>
            </TransitionLink>

            <TransitionLink to="/shop/sunglasses/kids" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Kids</p>
            </TransitionLink>
          </div>
        )}
      </div>

      {/* ------------------- EYEGLASSES DROPDOWN ------------------- */}
      <div className="flex flex-col">
        <button 
          onClick={() => setOpenEyeglasses(!openEyeglasses)}
          className="flex items-center justify-between text-regularTextPhone font-semibold py-[2vw]"
        >
          <div className="flex items-center gap-[2vw]">
            <Eye size={16} />
            <span>Eyeglasses</span>
          </div>

          {openEyeglasses ? <ChevronUp size={16}/> : <ChevronDown size={16} />}
        </button>

        {openEyeglasses && (
          <div className="flex flex-col gap-[1.5vw] pl-[6vw]">
            <TransitionLink to="/shop/eyeglasses/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">New Arrivals</p>
            </TransitionLink>

            <TransitionLink to="/shop/eyeglasses/bestsellers" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Bestsellers</p>
            </TransitionLink>

            <TransitionLink to="/shop/eyeglasses/women" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Women</p>
            </TransitionLink>

            <TransitionLink to="/shop/eyeglasses/men" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Men</p>
            </TransitionLink>

            <TransitionLink to="/shop/eyeglasses/kids" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-item">Kids</p>
            </TransitionLink>
          </div>
        )}
      </div>

      {/* -------------------- ACCESSORIES -------------------- */}
      <TransitionLink to="/accessories" onClick={() => setIsMobileMenuOpen(false)}>
        <p className="sidebar-link">Accessories</p>
      </TransitionLink>

      {/* -------------------- FREE EYE TEST -------------------- */}
      <TransitionLink to="/eye-test" onClick={() => setIsMobileMenuOpen(false)}>
        <p className="sidebar-link">Free Eye Test</p>
      </TransitionLink>

      {/* -------------------- BLOG -------------------- */}
      <p className="sidebar-link">Blog</p>

      {/* -------------------- ABOUT US -------------------- */}
      <TransitionLink to="/about-us" onClick={() => setIsMobileMenuOpen(false)}>
        <p className="sidebar-link">About Us</p>
      </TransitionLink>

      {/* -------------------- USER SECTION -------------------- */}
      <div className="mt-[5vw] pt-[4vw] border-t border-gray-200">
        {isAuthenticated ? (
          <TransitionLink to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center gap-[2vw] py-[2vw]">
              <span className="text-regularTextPhone font-bold">{user?.name}</span>
            </div>
          </TransitionLink>
        ) : (
          <div className="flex flex-col gap-[2vw]">
            <TransitionLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-link">Login</p>
            </TransitionLink>

            <TransitionLink to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <p className="sidebar-link">Sign Up</p>
            </TransitionLink>
          </div>
        )}
      </div>

    </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
  
  