import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import wishListFilled from '../../assets/images/icons/WishlistIconFilled.svg';
import productPlaceholder from '../../assets/images/productPlaceholder.png';
import axios from 'axios';
import { baseURL } from '@/url';

export default function WishList() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => { fetchWishlistItems(); }, [user]);

    const fetchWishlistItems = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${baseURL}/api/user/wishlist/${user._id}`, { withCredentials: true });
            if (res.data.success) setWishlistItems(res.data.wishlist);
        } catch (err) {
            console.error('Error fetching wishlist items:', err);
            setError('Failed to load wishlist items');
        }
    };

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        if (!user || loading) return;
        setLoading(true);
        try {
            const res = await axios.post(`${baseURL}/api/user/wishlist/remove`, { userId: user._id, productId }, { withCredentials: true });
            if (res.data.success) setWishlistItems(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = wishlistItems.filter(item =>
        item.modelTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <h2 className="font-dyeLine font-bold text-h3TextPhone md:text-h3Text">My Wishlist</h2>

            {/* Search bar */}
            <div className='w-full md:w-[17.5vw] p-[3vw] md:p-[.75vw] flex flex-row items-center shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] rounded-[10vw] md:rounded-[2.5vw]'>
                <input
                    className='text-smallTextPhone md:text-smallText w-full focus:outline-none'
                    placeholder='Search Your Wishlist'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={SearchIcon} className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw] ml-auto' />
            </div>

            {error && <p className='text-red-500 text-center text-regularTextPhone md:text-regularText'>{error}</p>}

            {filteredItems.length === 0 && !error && (
                <div className='flex flex-col items-center justify-center py-[12vw] md:py-12 text-gray-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[16vw] md:w-16 h-[16vw] md:h-16 mb-[4vw] md:mb-4 opacity-40' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className='font-semibold text-regularTextPhone md:text-regularText text-gray-500'>
                        {searchQuery ? 'No items match your search' : 'Your wishlist is empty'}
                    </p>
                    {!searchQuery && (
                        <p className='text-smallTextPhone md:text-sm text-gray-400 mt-[2vw] md:mt-2'>
                            Save items you love by tapping the heart icon on any product.
                        </p>
                    )}
                </div>
            )}

            {/* Horizontal list */}
            <div className='flex flex-col gap-[3vw] md:gap-3'>
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className='flex flex-row items-center gap-[3vw] md:gap-4 border border-gray-200 rounded-[3vw] md:rounded-xl p-[3vw] md:p-3 cursor-pointer hover:shadow-md transition-shadow bg-white'
                        onClick={() => navigate(`/product/${item._id}`)}
                    >
                        {/* Image */}
                        <img
                            src={item.images?.[0] || productPlaceholder}
                            alt={item.modelTitle}
                            className='w-[22vw] h-[22vw] md:w-20 md:h-20 object-cover rounded-[2vw] md:rounded-lg flex-shrink-0'
                        />

                        {/* Info */}
                        <div className='flex-1 min-w-0 flex flex-col gap-[1vw] md:gap-0.5'>
                            <p className='text-gray-400 text-[2.8vw] md:text-xs'>{item.brand}</p>
                            <h3 className='font-semibold text-gray-800 text-smallTextPhone md:text-sm leading-tight line-clamp-2'>
                                {[item.modelName, item.modelTitle].filter(Boolean).join(' - ')}
                            </h3>
                            {item.modelCode && (
                                <p className='text-gray-400 text-[2.5vw] md:text-xs'>{item.modelCode}</p>
                            )}
                            <span className='font-bold text-gray-900 text-smallTextPhone md:text-sm mt-[1vw] md:mt-1'>
                                ₹{item.price?.toLocaleString()}
                            </span>
                            {item.orders > 0 && (
                                <p className='text-[2.5vw] md:text-xs text-gray-400'>{item.orders} sold</p>
                            )}
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={(e) => handleRemove(e, item._id)}
                            disabled={loading}
                            className='flex-shrink-0 p-[2vw] md:p-2 hover:bg-red-50 rounded-full transition-colors'
                        >
                            <img src={wishListFilled} alt='remove' className='w-[5vw] h-[5vw] md:w-5 md:h-5' />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
