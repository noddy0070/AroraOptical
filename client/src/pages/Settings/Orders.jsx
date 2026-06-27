import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import Star from '../../assets/images/star.png';
import axios from 'axios';
import { baseURL } from '@/url';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/user/orders/${user._id}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getOrderStatus = (status) => {
        switch (status) {
            case 'Confirmed':
                return { text: 'Confirmed', color: 'text-green-600' };
            case 'Pending':
                return { text: 'Pending', color: 'text-yellow-600' };
            case 'Failed':
                return { text: 'Failed', color: 'text-red-600' };
            default:
                return { text: status, color: 'text-gray-600' };
        }
    };

    // Only keep entries where orderId was successfully populated
    const validOrders = (orders || []).filter(o => o.orderId);

    const filteredOrders = validOrders.filter(order => {
        if (!order.items) return false;
        if (!searchQuery) return true;
        return order.items.some(item =>
            (item.productId?.modelTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.productId?.modelCode || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <>
            <div className='ml-auto w-full md:w-[17.5vw] p-[3vw] md:p-[.75vw] items-center flex flex-row shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] font-bold rounded-[10vw] md:rounded-[2.5vw]'>
                <input 
                    className='text-smallTextPhone md:text-smallText w-full focus:outline-none' 
                    placeholder='Search Your Orders'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={SearchIcon} className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw] ml-auto'/>
            </div>

            {loading && <p className='text-center mt-8 text-regularTextPhone md:text-regularText'>Loading orders...</p>}
            {error && <p className='text-red-500 text-center mt-4 text-regularTextPhone md:text-regularText'>{error}</p>}
            
            {!loading && validOrders.length === 0 && (
                <div className='flex flex-col items-center justify-center py-[12vw] md:py-12 text-gray-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[16vw] md:w-16 h-[16vw] md:h-16 mb-[4vw] md:mb-4 opacity-40' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className='font-semibold text-regularTextPhone md:text-regularText text-gray-500'>No orders yet</p>
                    <p className='text-smallTextPhone md:text-sm text-gray-400 mt-[2vw] md:mt-2'>Your orders will appear here once you place one.</p>
                </div>
            )}
            {!loading && validOrders.length > 0 && filteredOrders.length === 0 && (
                <p className='text-center mt-8 text-gray-500 text-regularTextPhone md:text-regularText'>No orders match your search</p>
            )}

            {filteredOrders.map((orderItem, index) => {
                const order = orderItem.orderId;
                if (!order) return null;

                return (
                    <div key={order._id || index} className='flex flex-col font-roboto text-regularTextPhone md:text-regularText gap-[5.5vw] md:gap-[1.375vw] w-full mt-[6vw] md:mt-4'>
                        {/* Order Header */}
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-[4vw] md:p-4 bg-gray-50 rounded-[4vw] md:rounded-lg gap-[3vw] md:gap-0'>
                            <div>
                                <h3 className='font-bold text-h5TextPhone md:text-lg'>Order #{order._id.slice(-8)}</h3>
                                <p className='text-smallTextPhone md:text-sm text-gray-600'>Ordered on {formatDate(orderItem.date)}</p>
                            </div>
                            <div className='text-left md:text-right'>
                                <p className={`font-bold text-h6TextPhone md:text-regularText ${getOrderStatus(order.status).color}`}>
                                    {getOrderStatus(order.status).text}
                                </p>
                                <p className='text-smallTextPhone md:text-sm'>Total: ₹{order.finalAmount}</p>
                            </div>
                        </div>

                        {/* Order Items (from cart) */}
                        {orderItem.items && orderItem.items.map((item, itemIndex) => (
                            <div key={itemIndex} className='flex flex-col md:flex-row items-start md:items-center gap-[3vw] md:gap-[1.375vw] w-full'>
                                <img 
                                    className='w-full md:w-[10.625vw] h-[100vw] md:h-[11.1125vw] rounded-[1.5vw] md:rounded-[.375vw] object-cover' 
                                    src={item.productId?.images?.[0] || '/placeholder-product.png'}
                                    alt={item.productId?.modelTitle}
                                />
                                <div className='flex flex-col md:flex-row w-full md:w-[48.0625vw] gap-[3vw] md:gap-0'>
                                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw] flex-1'>
                                        <h6 className='text-h6TextPhone md:text-h6Text leading-[120%] font-bold'>
                                            {item.productId?.modelTitle || 'Product Name'}
                                        </h6>
                                        <span className='text-smallTextPhone md:text-smallText leading-[150%]'>
                                            {item.productId?.modelCode || 'Model Number'}
                                        </span>
                                        <span className='text-smallTextPhone md:text-smallText leading-[150%]'>
                                            Quantity: {item.quantity}
                                        </span>
                                        {item.lensType && item.lensType !== 'None' && (
                                            <span className='text-smallTextPhone md:text-smallText leading-[150%]'>
                                                Lens: {item.lensType}
                                            </span>
                                        )}
                                        {item.lensCoating && item.lensCoating !== 'None' && (
                                            <span className='text-smallTextPhone md:text-smallText leading-[150%]'>
                                                Coating: {item.lensCoating}
                                            </span>
                                        )}
                                        {item.lensThickness && item.lensThickness !== 'None' && (
                                            <span className='text-smallTextPhone md:text-smallText leading-[150%]'>
                                                Thickness: {item.lensThickness}
                                            </span>
                                        )}
                                        <span className='text-regularTextPhone md:text-regularText'>₹{item.totalAmount}</span>
                                    </div>
                                    <div className='ml-0 md:ml-auto flex flex-col'>
                                        <p className='text-regularTextPhone md:text-regularText leading-[150%]'>
                                            Delivery expected in 5-7 days
                                        </p>
                                        <button
                                            onClick={() => navigate(`/order/${order._id}`)}
                                            className='mt-[2vw] md:mt-auto ml-0 md:ml-auto underline text-[rgba(3,9,114,1)] cursor-pointer'
                                        >
                                            <p className='text-regularTextPhone md:text-regularText'>Track Order</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </>
    );
}