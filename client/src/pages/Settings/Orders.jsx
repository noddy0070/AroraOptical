import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import productPlaceholder from '../../assets/images/productPlaceholder.png';
import axios from 'axios';
import { baseURL } from '@/url';

const STATUS_STYLES = {
    Confirmed:  'bg-blue-100 text-blue-700',
    Pending:    'bg-yellow-100 text-yellow-700',
    Processing: 'bg-purple-100 text-purple-700',
    Shipped:    'bg-indigo-100 text-indigo-700',
    Delivered:  'bg-green-100 text-green-700',
    Cancelled:  'bg-red-100 text-red-700',
    Returned:   'bg-orange-100 text-orange-700',
    Failed:     'bg-red-100 text-red-700',
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => { fetchOrders(); }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/user/orders/${user._id}`, { withCredentials: true });
            if (res.data.success) setOrders(res.data.orders || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const validOrders = (orders || []).filter(o => o.orderId);

    const filteredOrders = validOrders.filter(orderItem => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return orderItem.items?.some(item => {
            const snap = item.productSnapshot || {};
            return (
                (snap.modelName  || item.productId?.modelName  || '').toLowerCase().includes(q) ||
                (snap.modelTitle || item.productId?.modelTitle || '').toLowerCase().includes(q) ||
                (snap.modelCode  || item.productId?.modelCode  || '').toLowerCase().includes(q)
            );
        });
    });

    return (
        <>
            <h2 className="font-dyeLine font-bold text-h3TextPhone md:text-h3Text">My Orders</h2>

            {/* Search bar */}
            <div className='w-full md:w-[17.5vw] p-[3vw] md:p-[.75vw] flex flex-row items-center shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] rounded-[10vw] md:rounded-[2.5vw]'>
                <input
                    className='text-smallTextPhone md:text-smallText w-full focus:outline-none'
                    placeholder='Search Your Orders'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={SearchIcon} className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw] ml-auto' />
            </div>

            {loading && <p className='text-center text-regularTextPhone md:text-regularText text-gray-500'>Loading orders…</p>}
            {error && <p className='text-red-500 text-center text-regularTextPhone md:text-regularText'>{error}</p>}

            {!loading && validOrders.length === 0 && !error && (
                <div className='flex flex-col items-center justify-center py-[12vw] md:py-12 text-gray-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[16vw] md:w-16 h-[16vw] md:h-16 mb-[4vw] md:mb-4 opacity-40' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className='font-semibold text-regularTextPhone md:text-regularText text-gray-500'>No orders yet</p>
                    <p className='text-smallTextPhone md:text-sm text-gray-400 mt-[2vw] md:mt-2'>Your orders will appear here once you place one.</p>
                </div>
            )}

            {!loading && validOrders.length > 0 && filteredOrders.length === 0 && (
                <p className='text-center text-gray-500 text-regularTextPhone md:text-regularText'>No orders match your search</p>
            )}

            {/* Order list */}
            <div className='flex flex-col gap-[3vw] md:gap-3'>
                {filteredOrders.map((orderItem, index) => {
                    const order = orderItem.orderId;
                    if (!order) return null;

                    const firstItem = orderItem.items?.[0];
                    const extraCount = (orderItem.items?.length || 1) - 1;
                    const snap = firstItem?.productSnapshot || {};
                    const image = snap.images?.[0] || firstItem?.productId?.images?.[0] || productPlaceholder;
                    const modelName  = snap.modelName  || firstItem?.productId?.modelName;
                    const modelTitle = snap.modelTitle || firstItem?.productId?.modelTitle;
                    const modelCode  = snap.modelCode  || firstItem?.productId?.modelCode;
                    const statusStyle = STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600';

                    return (
                        <div
                            key={order._id || index}
                            className='flex flex-row items-center gap-[3vw] md:gap-4 border border-gray-200 rounded-[3vw] md:rounded-xl p-[3vw] md:p-3 bg-white hover:shadow-md transition-shadow'
                        >
                            {/* Product image */}
                            <img
                                src={image}
                                alt={firstItem?.productId?.modelTitle || 'Product'}
                                className='w-[22vw] h-[22vw] md:w-20 md:h-20 object-cover rounded-[2vw] md:rounded-lg flex-shrink-0'
                            />

                            {/* Info */}
                            <div className='flex-1 min-w-0 flex flex-col gap-[1vw] md:gap-0.5'>
                                <div className='flex items-center gap-[2vw] md:gap-2 flex-wrap'>
                                    <p className='font-semibold text-gray-800 text-smallTextPhone md:text-sm'>
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <span className={`text-[2.5vw] md:text-[.6vw] px-[2vw] md:px-2 py-[.3vw] md:py-0.5 rounded-full font-medium ${statusStyle}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <p className='text-[2.8vw] md:text-xs text-gray-400'>{formatDate(orderItem.date)}</p>

                                {modelName && (
                                    <p className='text-smallTextPhone md:text-sm text-gray-700 font-medium line-clamp-1'>
                                        {modelName}
                                        {extraCount > 0 && <span className='text-gray-400 font-normal'> +{extraCount} more</span>}
                                    </p>
                                )}
                                {(modelCode || modelTitle) && (
                                    <p className='text-[2.5vw] md:text-xs text-gray-400 line-clamp-1'>
                                        {[modelCode, modelTitle].filter(Boolean).join(' · ')}
                                    </p>
                                )}

                                {firstItem?.size && (
                                    <p className='text-[2.5vw] md:text-xs text-gray-400'>
                                        Size: {firstItem.size}
                                    </p>
                                )}

                                {firstItem?.lensType && firstItem.lensType !== 'None' && (
                                    <p className='text-[2.5vw] md:text-xs text-gray-400'>
                                        {firstItem.lensType}
                                        {firstItem.lensCoating && firstItem.lensCoating !== 'None' && ` · ${firstItem.lensCoating}`}
                                    </p>
                                )}

                                <span className='font-bold text-gray-900 text-smallTextPhone md:text-sm mt-[1vw] md:mt-1'>
                                    ₹{order.finalAmount?.toLocaleString()}
                                </span>
                            </div>

                            {/* Track button */}
                            <button
                                onClick={() => navigate(`/order/${order._id}`)}
                                className='flex-shrink-0 flex flex-col items-center gap-[1vw] md:gap-1 text-[#030972] hover:opacity-70 transition-opacity'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[5vw] h-[5vw] md:w-5 md:h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span className='text-[2.5vw] md:text-xs font-medium'>Track</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
