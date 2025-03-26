import React from 'react';
import categoryPlaceholder from '../../../assets/images/CategoryPlaceholder.png';
import { IconButton, TitleButton } from '../../../components/button';
export default function Guide(){
    return (
        <div className=' py-[6vw] md:py-[7vw] md:px-[4vw] md:h-[57.3125vw]'>
            <div className='h-full w-full flex flex-col gap-[4.75vw]'>
                <div className='flex flex-col md:flex-row  md:w-[79.75vw] md:h-[28.8125vw] gap-[4.75vw]'>
                    <div className='h-[50vw] rounded-[6vw] md:h-full md:w-[51.25vw] md:rounded-[3.125vw] overflow-hidden'>
                        <img className='h-full w-full' src={categoryPlaceholder}></img>
                    </div>
                    <div className='flex flex-col md:w-[23.75vw] justify-center text-center md:text-left  gap-[1.5vw] h-full'>
                        
                        <h2 className='font-dyeLine font-bold leading-[100%]  mb-[1vw] text-h4TextPhone md:text-h2Text'>
                            Your Guide to Buy Eyewear Online
                        </h2>
                        <span className=' font-roboto justify-end text-regularTextPhone md:text-mediumText mb-[1vw]'>
                            Purchasing eyewear online is simple and convenient. Follow these easy steps to find your perfect pair.
                        </span>
                         <div className='flex flex-row justify-center group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 gap-[.1vw] '>
                            <TitleButton btnTitle={"Shop"} btnHeightPhone={12.5} btnWidthPhone={47}  btnRadiusPhone={9}  btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                            <IconButton btnSizePhone={12.5} iconWidthPhone={20} paddingPhone={1} btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                        </div>
                    </div>
                </div>
                <div className='md:h-[9.75vw] md:w-[88vw] gap-x-[2vw] gap-y-[6vw] md:gap-[4vw] grid grid-cols-2 md:flex md:flex-row'>
                    <div className='flex flex-col md:w-[19.5vw] h-full gap-[1vw] lg:gap-[1.5vw]'>
                        <h4 className=' text-h5TextPhone md:text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step1: Browser Our Extensive Collection
                        </h4>
                        <span className=' text-regularTextPhone md:text-regularText font-roboto'>
                            Explore a variety of styles and brands.
                        </span>
                    </div>

                    <div className='flex flex-col md:w-[19.5vw] h-full gap-[2vw] md:gap-[1.5vw]'>
                        <h4 className='text-h5TextPhone md:text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step2: Choose Your Perfect Fit
                        </h4>
                        <span className='text-regularTextPhone md:text-regularText font-roboto'>
                            Use our size guide to ensure a great fit.
                        </span>
                    </div>

                    <div className='flex flex-col md:w-[19.5vw] h-full gap-[1.5vw]'>
                        <h4 className='text-h5TextPhone md:text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step3: Add to Cart and Checkout
                        </h4>
                        <span className='text-regularTextPhone md:text-regularText font-roboto'>
                            Easily add your selections to your cart.
                        </span>
                    </div>

                    <div className='flex flex-col md:w-[19.5vw] h-full gap-[1.5vw]'>
                        <h4 className='text-h5TextPhone md:text-h4Text leading-[130%] font-bold font-dyeLine'>
                            Step4: Enjoy Fast and Secure Delivery
                        </h4>
                        <span className='text-regularTextPhone md:text-regularText font-roboto'>
                            Receive your eyewear at your doorstep quickly.
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    );
};
