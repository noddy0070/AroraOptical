import React from 'react'
import { TitleButton2 } from '@/components/button'
import { formatINR } from '@/components/IntToPrice'
import { useNavigate } from 'react-router-dom'
import { TransitionLink } from '@/Routes/TransitionLink'

const CartOrderSummary = ({ totalPrice, discount, finalPrice, replacementPolicyIcon, deliveryTimeIcon, loading, cartItems}) => {
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
                                </div>
                                <br/>
                            </div>
                            <div className='ml-auto '>
                                <p className=''>{formatINR(totalPrice)}</p>
                                <br/>
                                <p className='text-right'>-{formatINR(discount)}</p>
                                <br/>
                            </div>
                        </div>
                        <p className="w-full overflow-hidden whitespace-nowrap">---------------------------------------------------------------------------------------------------------</p>
                        <div className='flex flex-row justify-between'>
                            <div className='w-full'>
                                <p>Total</p>
                            </div>
                            <div className='ml-auto'>
                                <p>{formatINR(finalPrice)}</p>
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
                    <TransitionLink to="/checkout" data={cartItems}>
                    <TitleButton2 
                        className='mt-[1.25vw] mx-auto bg-black' 
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={loading ? "Processing..." : "Proceed to Checkout"}
                        onClick={() => navigate('/checkout')}
                    />
                    </TransitionLink>
                    <p className='text-[#767676] font-bold italic text-center'>Adding power and lens options are available at checkout*</p>
                </div>
  )
}

export default CartOrderSummary
