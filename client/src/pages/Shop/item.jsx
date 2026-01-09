import React, { useState, useEffect } from 'react';
import wishList from '../../assets/images/icons/WishlistIcon.svg';
import wishListFilled from '../../assets/images/icons/WishlistIconFilled.svg';
import star from '../../assets/images/star.png';
import { formatINR } from '@/components/IntToPrice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import { useNavigate } from 'react-router-dom';
import productPlaceholder from '../../assets/images/productPlaceholder.png';

export default function Item({product}) {
    const [hover, setHover] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);   
    const navigate = useNavigate();
    console.log('product', product);
    // Check if item is in wishlist on component mount
    useEffect(() => {
        const checkWishlist = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await axios.get(`${baseURL}/api/user/wishlist/${user._id}`, {
                        withCredentials: true
                    });
                    if (response.data.success) {
                        const isInList = response.data.wishlist.some(item => item._id === product._id);
                        setIsInWishlist(isInList);
                    }
                } catch (error) {
                    console.error('Error checking wishlist:', error);
                }
            }
        };
        checkWishlist();
    }, [user, isAuthenticated, product._id]);

    const handleWishlist = async (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Prevent event bubbling

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const endpoint = isInWishlist ? 'remove' : 'add';
            const response = await axios.post(`${baseURL}/api/user/wishlist/${endpoint}`, {
                userId: user._id,
                productId: product._id
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setIsInWishlist(!isInWishlist);
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
                    key={product._id}
                    className='bg-white rounded-[3vw] md:rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative'
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className='aspect-square overflow-hidden rounded-t-[3vw] md:rounded-t-lg relative'>
                      <img
                        src={product.images[0] || productPlaceholder}
                        alt={product.modelTitle}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      {/* Wishlist button for mobile */}
                      <button
                        onClick={handleWishlist}
                        disabled={loading}
                        className='absolute top-[2vw] right-[2vw] md:hidden bg-white/80 backdrop-blur-sm rounded-full p-[2vw] shadow-md z-10'
                        style={{ touchAction: 'manipulation' }}
                      >
                        <img 
                          src={isInWishlist ? wishListFilled : wishList} 
                          alt='wishlist'
                          className='w-[5vw] h-[5vw]'
                        />
                      </button>
                    </div>
                    <div className='p-[3vw] md:p-4'>
                      <div className='flex items-start justify-between gap-[2vw] md:gap-0 mb-[1.5vw] md:mb-1'>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-gray-800 text-tinyTextPhone md:text-smallTextPhone mb-[1vw] md:mb-1 line-clamp-2'>
                            {product.modelName} - {product.modelTitle}
                          </h3>
                          <p className='text-gray-600 text-tinyTextPhone md:text-tinyText'>{product.brand}</p>
                        </div>
                        {/* Desktop wishlist button */}
                        <button
                          onClick={handleWishlist}
                          disabled={loading}
                          className='hidden md:block flex-shrink-0 ml-2'
                        >
                          <img 
                            src={isInWishlist ? wishListFilled : wishList} 
                            alt='wishlist'
                            className='w-5 h-5'
                          />
                        </button>
                      </div>
                      <div className='flex items-center justify-between mt-[2vw] md:mt-0'>
                        <div className='flex flex-col gap-[0.5vw] md:gap-0'>
                          <span className='font-bold text-smallTextPhone md:text-mediumText'>
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.orders > 0 && (
                            <div className='text-tinyTextPhone md:text-xs text-gray-500 md:hidden'>
                              {product.orders} sold
                            </div>
                          )}
                        </div>
                        {/* {product.discount > 0 && (
                          <span className='text-green-600 text-xs'>
                            {product.discount}% off
                          </span>
                        )} */}
                      </div>
                      {product.orders > 0 && (
                        <div className='text-tinyTextPhone md:text-xs text-gray-500 mt-[1vw] md:mt-1 hidden md:block'>
                          {product.orders} sold
                        </div>
                      )}
                    </div>
                  </div>
    );
}
