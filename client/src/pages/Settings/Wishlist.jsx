import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DeleteIcon from '../../assets/images/icons/delete.svg';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import Star from '../../assets/images/star.png';
import axios from 'axios';
import { baseURL } from '@/url';
import { CartButton } from '../../components/button';

export default function WishList() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state) => state.auth);

    // Fetch wishlist items on component mount
    useEffect(() => {
        fetchWishlistItems();
    }, [user]);

    const fetchWishlistItems = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`${baseURL}/api/user/wishlist/${user._id}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
            setError('Failed to load wishlist items');
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/user/wishlist/remove`, {
                userId: user._id,
                productId
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setWishlistItems(wishlistItems.filter(item => item._id !== productId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            setError('Failed to remove item from wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/user/cart/add`, {
                userId: user._id,
                productId,
                quantity: 1
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                // Optionally remove from wishlist after adding to cart
                await handleRemoveFromWishlist(productId);
                alert('Product added to cart successfully!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    // Filter wishlist items based on search query
    const filteredItems = wishlistItems.filter(item => 
        item.modelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className='ml-auto w-[17.5vw] p-[.75vw] items-center flex flex-row shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] font-bold rounded-[2.5vw]'>
                <input 
                    className='text-smallText w-full focus:outline-none' 
                    placeholder='Search Your Wishlist'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={SearchIcon} className='w-[1.5vw] h-[1.5vw] ml-auto'/>
            </div>

            {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
            
            {filteredItems.length === 0 && !loading && (
                <p className='text-center mt-8 text-gray-500'>No items in your wishlist</p>
            )}

            {filteredItems.map((item) => (
                <div key={item._id} className='flex flex-row font-roboto text-regularText gap-[1.375vw] w-full mt-4'>
                    <img className='w-[10.625vw] h-[11.1125vw] rounded-[.375vw] object-cover' src={item.images[0]}/>
                    <div className='py-[1.15625vw] px-[0.625vw] flex flex-col gap-[.375vw] flex-grow'>
                        <span className='font-medium'>{item.brand}</span>
                        <div>
                            <h6 className='font-dyeLine text-h6Text font-bold leading-[140%]'>{item.modelTitle}</h6>
                            <span className='text-smallText font-light leading-[150%]'>{item.modelCode}</span>
                        </div>
                        <div className='flex flex-row'>
                            <img src={Star} alt='rating' className='w-[1vw] h-[1vw]'/>
                            <p className='text-smallText leading-[150%] ml-[2px]'>{item.orders || 0}</p>
                        </div>
                        <span className='text-h6Text'>₹{item.price}</span>
                        <div className='flex flex-row gap-2 mt-2'>
                            <CartButton onClick={() => handleAddToCart(item._id)} />
                        </div>
                    </div>
                    <button 
                        onClick={() => handleRemoveFromWishlist(item._id)}
                        disabled={loading}
                        className='self-start mt-4'
                    >
                        <img src={DeleteIcon} className='w-[1.5vw] h-[1.5vw]'/>
                    </button>
                </div>
            ))}
        </>
    );
};
