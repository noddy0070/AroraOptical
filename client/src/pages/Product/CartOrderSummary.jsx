import React from 'react'
import { TitleButton2 } from '@/components/button'
import { formatINR } from '@/components/IntToPrice'
import { useNavigate } from 'react-router-dom'
import { TransitionLink } from '@/Routes/TransitionLink'

const CartOrderSummary = ({ totalPrice, discount, finalPrice, replacementPolicyIcon, deliveryTimeIcon, loading, cartItems}) => {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-[5vw] md:gap-[1.25vw] w-full md:w-[34.5625vw] pr-0 md:pr-[3.625vw]'>
                    <p className='font-bold text-mediumTextPhone md:text-mediumText'>Order Summary</p>
                    <div className='flex flex-col font-medium justify-between gap-[2vw] md:gap-0'>
                        <div className='flex flex-row justify-between'>
                            <div className='w-full'>
                                <p className='text-regularTextPhone md:text-regularText'>MRP (Incl. Tax)</p>
                                <br className='hidden md:block'/>
                                <div className='flex flex-row w-full mt-[2vw] md:mt-0'>
                                    <p className='text-regularTextPhone md:text-regularText'>Discount</p>
                                </div>
                                <br className='hidden md:block'/>
                            </div>
                            <div className='ml-auto'>
                                <p className='text-regularTextPhone md:text-regularText'>{formatINR(totalPrice)}</p>
                                <br className='hidden md:block'/>
                                <p className='text-right text-regularTextPhone md:text-regularText mt-[2vw] md:mt-0'>-{formatINR(discount)}</p>
                                <br className='hidden md:block'/>
                            </div>
                        </div>
                        <p className="w-full overflow-hidden whitespace-nowrap text-tinyTextPhone md:text-regularText">---------------------------------------------------------------------------------------------------------</p>
                        <div className='flex flex-row justify-between mt-[2vw] md:mt-0'>
                            <div className='w-full'>
                                <p className='text-regularTextPhone md:text-regularText font-bold'>Total</p>
                            </div>
                            <div className='ml-auto'>
                                <p className='text-regularTextPhone md:text-regularText font-bold'>{formatINR(finalPrice)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between mx-auto w-full md:w-[23.1875vw] gap-[4vw] md:gap-0'>
                        <div className='flex flex-col text-center'>
                            <img className='w-[16vw] md:w-[4vw] max-w-none md:max-w-[64px] max-h-none md:max-h-[64px] h-[16vw] md:h-[4vw] mx-auto' src={replacementPolicyIcon}/>
                            <p className='whitespace-nowrap text-smallTextPhone md:text-regularText'>10 Days Replacement Policy</p>
                        </div>
                        <div className='flex flex-col text-center'>
                            <img className='w-[16vw] md:w-[4vw] h-[16vw] md:h-[4vw] max-w-none md:max-w-[64px] max-h-none md:max-h-[64px] mx-auto' src={deliveryTimeIcon}/>
                            <p className='whitespace-nowrap text-smallTextPhone md:text-regularText'>Fast Delivery</p>
                        </div>
                    </div>
                    <TransitionLink to="/checkout" data={cartItems}>
                    <TitleButton2 
                        className='mt-[5vw] md:mt-[1.25vw] mx-auto bg-black w-full md:w-auto' 
                        btnHeightPhone={12}
                        btnWidthPhone={100}
                        btnRadiusPhone={12}
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={loading ? "Processing..." : "Proceed to Checkout"}
                        onClick={() => navigate('/checkout')}
                    />
                    </TransitionLink>
                    <p className='text-[#767676] font-bold italic text-center text-smallTextPhone md:text-regularText'>Adding power and lens options are available at checkout*</p>
                </div>
  )
}

export default CartOrderSummary
