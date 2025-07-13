import React, { useState, useEffect } from 'react'
import { mapBrandToLogo } from '@/data/brandMap';
import { formatINR } from '@/components/IntToPrice';
import close from '../../assets/images/icons/close.svg';
import subtract from '../../assets/images/icons/subtract.svg';
import add from '../../assets/images/icons/add.svg';
import edit from '../../assets/images/icons/Edit.svg';
import { TransitionLink } from '@/Routes/TransitionLink';
import axios from 'axios';
import { baseURL } from '@/url';
import { useSelector } from 'react-redux';
    
const CartItem = ({item, handleRemoveItem, updateQuantity}) => {
   const [prescription,setPrescription]=useState(null);
   const { user } = useSelector(state => state.auth);
   useEffect(()=>{
    const fetchPrescription=async()=>{
        const response=await axios.get(`${baseURL}/api/user/prescription/${user._id}`);
        setPrescription(response.data.prescriptions);
    }
    fetchPrescription();
   },[user._id]);  
   const filteredPrescription=prescription.filter(prescription=>prescription._id===item.prescriptionId);
   console.log(filteredPrescription);

  return (
    <div key={item.productId._id} className='flex flex-col gap-[1.25vw] border-b-[1px] border-gray-400 py-[1.5vw]'>  
                            <div className='flex flex-row gap-[1vw]'>
                                <img src={item.productId.images[0]} className='w-[17.1875vw] max-w-[275px] max-h-[288px] h-[18vw] rounded-[clamp(0px,1.375vw,22px)]' />
                                <div className='w-full my-[.5vw]'>
                                    <div className='flex flex-row gap-between mb-[1.25vw]'>
                                        <img src={mapBrandToLogo[item.productId.brand]} className=' h-[2.25vw] w-auto'/>
                                        <div className='flex flex-row w-auto ml-auto justify-end gap-[.5vw] items-center'>
                                            <p onClick={() => handleRemoveItem(item.productId._id)} className='cursor-pointer font-bold text-black opacity-70'>Remove</p>
                                            <img src={close} onClick={() => handleRemoveItem(item.productId._id)} className='cursor-pointer clickable w-[1.25vw] h-[1.25vw]'/>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-between items-start'>
                                    <div className='mb-[1.25vw]'>
                                        <TransitionLink to={`/product/${item.productId._id}`}>
                                        <p className='font-bold text-regularText leading-[150%] mb-[.5vw] hover:underline cursor-pointer'>{item.productId.modelTitle}</p>
                                        </TransitionLink>

                                        <TransitionLink to={`/product/${item.productId._id}`}>
                                        <p className=' text-smallText leading-[150%] hover:underline cursor-pointer'>{item.productId.modelName}</p>
                                        </TransitionLink>
                                    </div>
                                    <div className='ml-auto'>
                                        <p className='font-bold text-regularText'>{formatINR(item.productId.price)}</p>
                                    </div>
                                    </div>
                                       
                                    <p className='mb-[4px] text-regularText leading-[150%] font-medium'>Total Amount:</p>
                                    <p className='mb-[1.25vw] text-regularText leading-[150%] font-medium'>{formatINR(item.totalAmount * item.quantity)}</p>

                                    <div className='gap-[.5vw]'>
                                        <p className='text-tinyText leading-[150%]'>Quantity</p>
                                    <div className='flex flex-row gap-[.5vw] mt-[.5vw] items-center'>
                                        <img 
                                            src={subtract} 
                                            className='cursor-pointer w-[1.5vw] h-[1.5vw]'
                                            onClick={() => updateQuantity(item.productId._id, -1)}
                                        />
                                        <p className='w-[4vw] text-smallText py-[.1vw] text-center border-black border-[.1vw] rounded-[1.25vw]'>{item.quantity}</p>
                                        <img 
                                            src={add} 
                                            className='cursor-pointer max-w-[30px] max-h-[30px] w-[1.5vw] h-[1.5vw]'
                                            onClick={() => updateQuantity(item.productId._id, 1)}
                                        />
                                    </div>
                                    </div>
                                </div>
                            </div>
                            {
                                item.productId.rx && (
                                    <div className='flex flex-row pb-[1.25vw] gap-[2.8125vw]'>
                                        <div className='flex flex-row p-[.625vw] border-black border-[.1vw] rounded-[.625vw] gap-[.5vw]'>
                                            <div className='w-[3.125vw] h-[3.125vw] rounded-[.625vw] bg-gray-400'></div>
                                            <div className='flex flex-col gap-[.5vw]'>
                                                <div className='flex flex-row gap-[.5vw]'>
                                                <p className='text-regularText font-dyeLine leading-[150%] font-bold'>Single Vision</p>
                                                <TransitionLink to={`/lens/${item.productId._id}`}>
                                                <img className='w-[1.25vw] h-[1.25vw] cursor-pointer' src={edit}/>
                                                </TransitionLink>
                                                </div>
                                                <p className='text-smallText font-roboto leading-[150%]'>{item.lensType?item.lensType:'No Lens Selected'}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-row p-[.625vw] border-black border-[.1vw] rounded-[.625vw] gap-[.5vw]'>
                                            <div className='w-[3.125vw] h-[3.125vw] rounded-[.625vw] bg-gray-400'></div>
                                            <div className='flex flex-col gap-[.5vw]'>
                                                <div className='flex flex-row gap-[.5vw]'>
                                                <p className='text-regularText font-dyeLine leading-[150%] font-bold'>Lens Coating</p>
                                                <TransitionLink to={`/lens/${item.productId._id}`}> 
                                                <img className='w-[1.25vw] h-[1.25vw] cursor-pointer' src={edit}/>
                                                </TransitionLink>
                                                </div>
                                                <p className='text-smallText font-roboto leading-[150%]'>{item.lensCoating?item.lensCoating:'No Lens Coating Selected'}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-row p-[.625vw] border-black border-[.1vw] rounded-[.625vw] gap-[.5vw]'>
                                            <div className='w-[3.125vw] h-[3.125vw] rounded-[.625vw] bg-gray-400'></div>
                                            <div className='flex flex-col gap-[.5vw]'>
                                                <div className='flex flex-row gap-[.5vw]'>
                                                <p className='text-regularText font-dyeLine leading-[150%] font-bold'>Prescription</p>
                                                <TransitionLink to={`/lens/${item.productId._id}`}>
                                                <img className='w-[1.25vw] h-[1.25vw] cursor-pointer' src={edit}/>
                                                </TransitionLink>
                                                </div>
                                                <p className='text-smallText font-roboto leading-[150%]'>{item.prescriptionId?filteredPrescription[0].prescriptionName:'No Prescription Selected'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )   
                            }
                        </div>
  )
}

export default CartItem
