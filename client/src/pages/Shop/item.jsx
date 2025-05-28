import React, { useState, useEffect } from 'react';
import wishList from '../../assets/images/icons/WishlistIcon.svg';
import wishListFilled from '../../assets/images/icons/WishlistIconFilled.svg';
import star from '../../assets/images/star.png';
import { formatINR } from '@/components/IntToPrice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import { useNavigate } from 'react-router-dom';

export default function Item({comapny, price, image, rating, title, colour, productId}) {
    const [hover, setHover] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);   
    const navigate = useNavigate();

    // Check if item is in wishlist on component mount
    useEffect(() => {
        const checkWishlist = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await axios.get(`${baseURL}/api/user/wishlist/${user._id}`, {
                        withCredentials: true
                    });
                    if (response.data.success) {
                        const isInList = response.data.wishlist.some(item => item._id === productId);
                        setIsInWishlist(isInList);
                    }
                } catch (error) {
                    console.error('Error checking wishlist:', error);
                }
            }
        };
        checkWishlist();
    }, [user, isAuthenticated, productId]);

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
                productId: productId
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
        <div className='relative overflow-hidden font-roboto shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] rounded-[1.25vw]'>
            <div className='relative overflow-hidden h-[17.3125vw] mb-[.5vw]'>
                <div className="img-container" style={{"--aspect-ratio": "100%"}}>
                    <img 
                        loading="lazy"
                        onMouseEnter={()=>setHover(true)} 
                        onMouseLeave={()=>setHover(false)}  
                        style={{
                            transform: hover ? 'scale(1.25)' : 'scale(1)',
                            transition: 'transform 0.3s ease-in-out'
                        }} 
                        src={image} 
                        alt={title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className='object-cover z-[0] overflow-hidden max-h-[17.3125vw] transition-transform duration-700 cursor-pointer w-[100%] h-[17.3125vw] rounded-t-[1.25vw] mb-[.5vw] blur-load image-loading'
                    />
                </div>
                <button 
                    onClick={handleWishlist}
                    disabled={loading}
                    className='absolute right-[1.25vw] top-[1.25vw] w-[1.565vw] h-auto cursor-pointer transition-transform hover:scale-110'
                >
                    <img 
                        src={isInWishlist ? wishListFilled : wishList} 
                        alt='wishlist'
                        loading="lazy"
                        className='w-full h-auto'
                    />
                </button>
            </div>
            
            <div className='px-[.625vw] overflow-hidden z-[2] pb-[.5vw]'>
                <div className='flex flex-row mb-[.375vw]'>
                    <p className='text-regularText font-medium'>{comapny}</p>
                    <img src={star} alt='rating' className='ml-auto w-[1vw] h-[1vw]'/>
                    <p className='text-smallText leading-[150%] ml-[2px]'>{rating}</p>
                </div>
                <h6 className='text-h6Text font-bold font-dyeLine leading-[140%]'>{title}</h6>
                <span className='text-smallText font-light leading-[150%]'>{colour}</span>
                <h6 className='text-h6Text mt-[.375vw] leading-[140%]'>{formatINR(price)}</h6>
            </div>
            <button className='w-full px-[.90625vw] py-[.45375vw] rounded-[1.25vw] bg-[rgba(29,50,64,.5)] hover:bg-[rgba(29,50,64,.7)] transition-colors duration-300'>
                <span className='text-regularText font-semibold leading-[150%]'>Add To Cart</span>
            </button>
        </div>
    );
}
