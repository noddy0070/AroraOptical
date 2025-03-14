import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import { IconButton, TitleButton } from '../../../components/button';
export default function Guide(){
    return (
        <div className='py-[7vw] px-[4vw] h-[57.3125vw]'>
            <div className='h-full w-full flex flex-col gap-[4.75vw]'>
                <div className='flex flex-row w-[79.75vw] h-[28.8125vw] gap-[4.75vw]'>
                    <div className=' h-full w-[51.25vw] rounded-[3.125vw] overflow-hidden'>
                        <img className='h-full w-full' src={categoryPlaceholder}></img>
                    </div>
                    <div className='flex flex-col w-[23.75vw] justify-center  gap-[1.5vw] h-full'>
                        
                        <h2 className='font-dyeLine font-bold leading-[100%] mb-[1vw] text-h2Text'>
                            Your Guide to Buy Eyewear Online
                        </h2>
                        <span className=' font-roboto justify-end text-mediumText mb-[1vw]'>
                            Purchasing eyewear online is simple and convenient. Follow these easy steps to find your perfect pair.
                        </span>
                         <div className='flex flex-row justify-center group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 gap-[.1vw] '>
                            <TitleButton btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                            <IconButton btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                        </div>
                    </div>
                </div>
                <div className='h-[9.75vw] w-[88vw] gap-[4vw] flex flex-row'>
                    <div className='flex flex-col w-[19.5vw] h-full gap-[1vw] lg:gap-[1.5vw]'>
                        <h4 className='text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step1: Browser Our Extensive Collection
                        </h4>
                        <span className='text-regularText font-roboto'>
                            Explore a variety of styles and brands.
                        </span>
                    </div>

                    <div className='flex flex-col w-[19.5vw] h-full gap-[1.5vw]'>
                        <h4 className='text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step2: Choose Your Perfect Fit
                        </h4>
                        <span className='text-regularText font-roboto'>
                            Use our size guide to ensure a great fit.
                        </span>
                    </div>

                    <div className='flex flex-col w-[19.5vw] h-full gap-[1.5vw]'>
                        <h4 className='text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step3: Add to Cart and Checkout
                        </h4>
                        <span className='text-regularText font-roboto'>
                            Easily add your selections to your cart.
                        </span>
                    </div>

                    <div className='flex flex-col w-[19.5vw] h-full gap-[1.5vw]'>
                        <h4 className='text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step4: Enjoy Fast and Secure Delivery
                        </h4>
                        <span className='text-regularText font-roboto'>
                            Receive your eyewear at your doorstep quickly.
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    );
};
