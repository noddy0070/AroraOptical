import React, { useState, useEffect } from 'react'
import { formatINR } from '@/components/IntToPrice';
import subtract from '../../assets/images/icons/subtract.svg';
import add from '../../assets/images/icons/add.svg';
import edit from '../../assets/images/icons/Edit.svg';
import { TransitionLink } from '@/Routes/TransitionLink';
import { api } from '@/lib/axios';
import { useSelector } from 'react-redux';

const lensThicknessMap = {
    "Medium": "1.56",
    "Thick":  "1.59",
};

const CartItem = ({ item, handleRemoveItem, updateQuantity }) => {
    const [prescription, setPrescription] = useState([]);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchPrescription = async () => {
            const response = await api.get(`/api/user/prescription/${user._id}`);
            setPrescription(response.data.prescriptions);
        };
        fetchPrescription();
    }, [user._id]);

    const filteredPrescription = prescription.filter(p => p._id === item.prescriptionId);
    const product = item.productId;

    return (
        <div className='flex flex-col gap-[4vw] md:gap-[1vw] border-b border-gray-200 py-[5vw] md:py-[1.25vw]'>

            {/* Main row: image + info */}
            <div className='flex flex-row gap-[4vw] md:gap-[1.25vw] items-start'>

                {/* Image with border */}
                <TransitionLink to={`/product/${product._id}`} className='flex-shrink-0'>
                    <div className='border border-gray-200 rounded-[3vw] md:rounded-xl overflow-hidden w-[28vw] h-[28vw] md:w-28 md:h-28 bg-gray-50'>
                        <img
                            src={product.images?.[0]}
                            alt={product.modelTitle}
                            className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                        />
                    </div>
                </TransitionLink>

                {/* Info */}
                <div className='flex-1 min-w-0 flex flex-col gap-[1.5vw] md:gap-[.3vw]'>

                    {/* Brand + Remove */}
                    <div className='flex items-start justify-between gap-[2vw] md:gap-2'>
                        <p className='text-[2.8vw] md:text-xs text-gray-400 font-medium uppercase tracking-wide'>{product.brand}</p>
                        <button
                            onClick={() => handleRemoveItem(product._id)}
                            className='text-[2.8vw] md:text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex-shrink-0'
                        >
                            Remove
                        </button>
                    </div>

                    {/* Model title */}
                    <TransitionLink to={`/product/${product._id}`}>
                        <p className='font-bold text-smallTextPhone md:text-sm leading-tight hover:underline cursor-pointer text-gray-900 line-clamp-2'>
                            {product.modelTitle}
                        </p>
                    </TransitionLink>

                    {/* Model name */}
                    <TransitionLink to={`/product/${product._id}`}>
                        <p className='text-[2.8vw] md:text-xs text-gray-500 hover:underline cursor-pointer leading-tight'>
                            {product.modelName}
                        </p>
                    </TransitionLink>

                    {/* Model code */}
                    {product.modelCode && (
                        <p className='text-[2.5vw] md:text-[.65vw] text-gray-400'>{product.modelCode}</p>
                    )}

                    {/* Size */}
                    {item.size && (
                        <p className='text-[2.5vw] md:text-[.65vw] text-gray-500'>Size: <span className='font-medium'>{item.size}</span></p>
                    )}

                    {/* Price per unit */}
                    <p className='text-smallTextPhone md:text-sm font-bold text-gray-900 mt-[1vw] md:mt-[.25vw]'>
                        {formatINR(product.price)}
                    </p>

                    {/* Total + quantity */}
                    <div className='flex items-center justify-between gap-[2vw] md:gap-2 mt-[1.5vw] md:mt-[.4vw]'>
                        <div className='flex items-center gap-[2vw] md:gap-[.5vw]'>
                            <img
                                src={subtract}
                                className='cursor-pointer w-[5.5vw] md:w-5 h-[5.5vw] md:h-5'
                                onClick={() => updateQuantity(product._id, -1)}
                            />
                            <p className='w-[10vw] md:w-8 text-smallTextPhone md:text-sm py-[.5vw] md:py-[.15vw] text-center border border-gray-300 rounded-[3vw] md:rounded-lg'>
                                {item.quantity}
                            </p>
                            <img
                                src={add}
                                className='cursor-pointer w-[5.5vw] md:w-5 h-[5.5vw] md:h-5'
                                onClick={() => updateQuantity(product._id, 1)}
                            />
                        </div>
                        <p className='text-smallTextPhone md:text-sm font-semibold text-gray-700'>
                            Total: {formatINR((item.totalAmount ?? product.price) * item.quantity)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lens info (only for Rx products) */}
            {product.rx && (
                <div className='flex flex-row flex-wrap gap-[2vw] md:gap-[.5vw] pb-[2vw] md:pb-[.5vw]'>

                    <div className='flex flex-row items-center p-[2vw] md:p-[.5vw] border border-gray-200 rounded-[2vw] md:rounded-lg gap-[2vw] md:gap-[.5vw]'>
                        <div className='flex flex-col gap-[.5vw] md:gap-[.1vw]'>
                            <div className='flex flex-row items-center gap-[1.5vw] md:gap-[.4vw]'>
                                <p className='text-[2.8vw] md:text-xs font-bold text-gray-700 whitespace-nowrap'>Vision Type</p>
                                <TransitionLink to={`/lens/${product._id}`}>
                                    <img className='w-[4vw] md:w-[.9vw] h-[4vw] md:h-[.9vw] cursor-pointer opacity-60 hover:opacity-100' src={edit} />
                                </TransitionLink>
                            </div>
                            <p className='text-[2.5vw] md:text-[.65vw] text-gray-500'>{item.lensType || 'Not selected'}</p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center p-[2vw] md:p-[.5vw] border border-gray-200 rounded-[2vw] md:rounded-lg gap-[2vw] md:gap-[.5vw]'>
                        <div className='flex flex-col gap-[.5vw] md:gap-[.1vw]'>
                            <div className='flex flex-row items-center gap-[1.5vw] md:gap-[.4vw]'>
                                <p className='text-[2.8vw] md:text-xs font-bold text-gray-700 whitespace-nowrap'>Lens Coating</p>
                                <TransitionLink to={`/lens/${product._id}`}>
                                    <img className='w-[4vw] md:w-[.9vw] h-[4vw] md:h-[.9vw] cursor-pointer opacity-60 hover:opacity-100' src={edit} />
                                </TransitionLink>
                            </div>
                            <p className='text-[2.5vw] md:text-[.65vw] text-gray-500'>{item.lensCoating || 'Not selected'}</p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center p-[2vw] md:p-[.5vw] border border-gray-200 rounded-[2vw] md:rounded-lg gap-[2vw] md:gap-[.5vw]'>
                        <div className='flex flex-col gap-[.5vw] md:gap-[.1vw]'>
                            <div className='flex flex-row items-center gap-[1.5vw] md:gap-[.4vw]'>
                                <p className='text-[2.8vw] md:text-xs font-bold text-gray-700 whitespace-nowrap'>Lens Thickness</p>
                                <TransitionLink to={`/lens/${product._id}`}>
                                    <img className='w-[4vw] md:w-[.9vw] h-[4vw] md:h-[.9vw] cursor-pointer opacity-60 hover:opacity-100' src={edit} />
                                </TransitionLink>
                            </div>
                            <p className='text-[2.5vw] md:text-[.65vw] text-gray-500'>
                                {item.lensThickness ? `Index ${lensThicknessMap[item.lensThickness]} (${item.lensThickness})` : 'Not selected'}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-row items-center p-[2vw] md:p-[.5vw] border border-gray-200 rounded-[2vw] md:rounded-lg gap-[2vw] md:gap-[.5vw]'>
                        <div className='flex flex-col gap-[.5vw] md:gap-[.1vw]'>
                            <div className='flex flex-row items-center gap-[1.5vw] md:gap-[.4vw]'>
                                <p className='text-[2.8vw] md:text-xs font-bold text-gray-700 whitespace-nowrap'>Prescription</p>
                                <TransitionLink to={`/lens/${product._id}`}>
                                    <img className='w-[4vw] md:w-[.9vw] h-[4vw] md:h-[.9vw] cursor-pointer opacity-60 hover:opacity-100' src={edit} />
                                </TransitionLink>
                            </div>
                            <p className='text-[2.5vw] md:text-[.65vw] text-gray-500'>
                                {item.prescriptionId ? (filteredPrescription[0]?.prescriptionName || 'Linked') : 'Not selected'}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default CartItem;
