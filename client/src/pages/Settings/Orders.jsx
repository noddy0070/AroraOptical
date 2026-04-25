import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
                setOrders(response.data.orders);
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

    // Filter orders based on search query
    const filteredOrders = orders.filter(order => {
        if (!order.items) return false;
        return order.items.some(item => 
            item.productId?.modelTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.productId?.modelCode?.toLowerCase().includes(searchQuery.toLowerCase())
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
            
            {filteredOrders.length === 0 && !loading && (
                <p className='text-center mt-8 text-gray-500 text-regularTextPhone md:text-regularText'>No orders found</p>
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
                                <p className='text-smallTextPhone md:text-sm'>Total: ₹{order.finalAmount/100}</p>
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
                                        <a className='mt-[2vw] md:mt-auto ml-0 md:ml-auto underline text-[rgba(3,9,114,1)]'>
                                            <p className='text-regularTextPhone md:text-regularText'>Track Order</p>
                                        </a>
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