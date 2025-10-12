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
                    className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group'
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className='aspect-square overflow-hidden rounded-t-lg'>
                      <img
                        src={product.images[0] || productPlaceholder}
                        alt={product.modelTitle}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold text-gray-800 text-tinyTextPhone md:text-smallTextPhone  mb-1 line-clamp-2'>
                        {product.modelTitle}
                      </h3>
                      <p className='text-gray-600 text-tinyTextPhone md:text-tinyText '>{product.brand}</p>
                      <div className='flex items-center justify-between'>
                        <span className=' font-bold text-smallTextPhone md:text-mediumText'>
                          ₹{product.price.toLocaleString()}
                        </span>
                        {/* {product.discount > 0 && (
                          <span className='text-green-600 text-xs'>
                            {product.discount}% off
                          </span>
                        )} */}
                      </div>
                      {product.orders > 0 && (
                        <div className='text-xs text-gray-500 mt-1'>
                          {product.orders} sold
                        </div>
                      )}
                    </div>
                  </div>
    );
}
