import React from 'react'
import { TitleButton2 } from '@/components/button'
import { formatINR } from '@/components/IntToPrice'
import { useNavigate } from 'react-router-dom'

const CartOrderSummary = ({totalPrice, discount, deliveryPrice, finalPrice, replacementPolicyIcon, deliveryTimeIcon, loading}) => {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-[1.25vw] w-[34.5625vw] pr-[3.625vw]'>
                    <p className='font-bold text-mediumText'>Order Summary</p>
                    <div className='flex flex-col font-medium justify-between'>
                        <div className='flex flex-row justify-between'>
                            <div className='w-full'>
                                <p>MRP (Incl. Tax)</p>
                                <br/>
                                <div className='flex flex-row w-full'>
                                    <p>Discount</p>
                                    <span className='ml-auto'>-</span>
                                </div>
                                <br/>
                                <p>Shipping Charges</p>
                            </div>
                            <div className='ml-auto'>
                                <p>₹{totalPrice}</p>
                                <br/>
                                <p>₹{discount}</p>
                                <br/>
                                <p>₹{deliveryPrice}</p>
                            </div>
                        </div>
                        <p className="w-full overflow-hidden whitespace-nowrap">---------------------------------------------------------------------------------------------------------</p>
                        <div className='flex flex-row justify-between'>
                            <div className='w-full'>
                                <p>Total</p>
                            </div>
                            <div className='ml-auto'>
                                <p>₹{finalPrice}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between mx-auto w-[23.1875vw]'>
                        <div className='flex flex-col text-center'>
                            <img className='w-[4vw] max-w-[64px] max-h-[64px] h-[4vw] mx-auto' src={replacementPolicyIcon}/>
                            <p className='whitespace-nowrap'>10 Days Replacement Policy</p>
                        </div>
                        <div className='flex flex-col text-center'>
                            <img className='w-[4vw] h-[4vw] max-w-[64px] max-h-[64px] mx-auto' src={deliveryTimeIcon}/>
                            <p className='whitespace-nowrap'>Fast Delivery</p>
                        </div>
                    </div>
                    <TitleButton2 
                        className='mt-[1.25vw] mx-auto bg-black' 
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={loading ? "Processing..." : "Proceed to Checkout"}
                        onClick={() => navigate('/checkout')}
                    />
                    <p className='text-[#767676] font-bold italic text-center'>Adding power and lens options are available at checkout*</p>
                </div>
  )
}

export default CartOrderSummary
