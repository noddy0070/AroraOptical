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
                console.log('Orders data:', response.data.orders);
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
            <div className='ml-auto w-[17.5vw] p-[.75vw] items-center flex flex-row shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] font-bold rounded-[2.5vw]'>
                <input 
                    className='text-smallText w-full focus:outline-none' 
                    placeholder='Search Your Orders'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={SearchIcon} className='w-[1.5vw] h-[1.5vw] ml-auto'/>
            </div>

            {loading && <p className='text-center mt-8'>Loading orders...</p>}
            {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
            
            {filteredOrders.length === 0 && !loading && (
                <p className='text-center mt-8 text-gray-500'>No orders found</p>
            )}

            {filteredOrders.map((orderItem, index) => {
                const order = orderItem.orderId;
                if (!order) return null;

                return (
                    <div key={order._id || index} className='flex flex-col font-roboto text-regularText gap-[1.375vw] w-full mt-4'>
                        {/* Order Header */}
                        <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
                            <div>
                                <h3 className='font-bold text-lg'>Order #{order._id.slice(-8)}</h3>
                                <p className='text-sm text-gray-600'>Ordered on {formatDate(orderItem.date)}</p>
                            </div>
                            <div className='text-right'>
                                <p className={`font-bold ${getOrderStatus(order.status).color}`}>
                                    {getOrderStatus(order.status).text}
                                </p>
                                <p className='text-sm'>Total: ₹{order.finalAmount/100}</p>
                            </div>
                        </div>

                        {/* Order Items (from cart) */}
                        {orderItem.items && orderItem.items.map((item, itemIndex) => (
                            <div key={itemIndex} className='flex flex-row items-center gap-[1.375vw] w-full'>
                                <img 
                                    className='w-[10.625vw] h-[11.1125vw] rounded-[.375vw] object-cover' 
                                    src={item.productId?.images?.[0] || '/placeholder-product.png'}
                                    alt={item.productId?.modelTitle}
                                />
                                <div className='flex flex-row w-[48.0625vw]'>
                                    <div className='flex flex-col gap-[.5vw]'>
                                        <h6 className='text-h6Text leading-[120%] font-bold'>
                                            {item.productId?.modelTitle || 'Product Name'}
                                        </h6>
                                        <span className='text-smallText leading-[150%]'>
                                            {item.productId?.modelCode || 'Model Number'}
                                        </span>
                                        <span className='text-smallText leading-[150%]'>
                                            Quantity: {item.quantity}
                                        </span>
                                        {item.lensType && item.lensType !== 'None' && (
                                            <span className='text-smallText leading-[150%]'>
                                                Lens: {item.lensType}
                                            </span>
                                        )}
                                        {item.lensCoating && item.lensCoating !== 'None' && (
                                            <span className='text-smallText leading-[150%]'>
                                                Coating: {item.lensCoating}
                                            </span>
                                        )}
                                        {item.lensThickness && item.lensThickness !== 'None' && (
                                            <span className='text-smallText leading-[150%]'>
                                                Thickness: {item.lensThickness}
                                            </span>
                                        )}
                                        <span className='text-regularText'>₹{item.totalAmount}</span>
                                    </div>
                                    <div className='ml-auto flex flex-col'>
                                        <p className='text-regularText leading-[150%]'>
                                            Delivery expected in 5-7 days
                                        </p>
                                        <a className='mt-auto ml-auto underline text-[rgba(3,9,114,1)]'>
                                            <p>Track Order</p>
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