import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import { IconButton } from '../../../components/button';
export default function Discover(){
    return (
        <div className=' pl-[4vw] py-[7vw] h-[48.25vw] flex flex-row gap-[1vw]'>
            <div className='relative w-[41.625vw]'> 
                <h1 className='font-dyeLine text-h3Text leading-[100%] lg:leading-[120%]  font-bold mb-[.5vw] lg:mb-[1.5vw]'>
                    Discover Our Exclusive Collection of International Eyewear Brands Today!
                </h1>
                <span className='font-roboto text-mediumText hidden lg:block'> 
                Explore a diverse range of eyewear from top international brands that blend style and quality. Our curated selection ensures you find the perfect pair for any occasion.
                </span>
                <span className='font-roboto text-mediumText lg:hidden '> 
                Explore a diverse range of eyewear from top international brands that blend style and quality.
                </span>
                <div className='absolute flex flex-row gap-[1.5vw] bottom-0 md:pt-[1vw]  h-[18.75vw]     '>
                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={categoryPlaceholder}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                                Global Brands
                            </h6>
                            <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                                Featuring renowned names like Ray-Ban, Oakley, and Gucci for every eyewear enthusiast.
                            </span>

                        </div>
                    </div>

                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={categoryPlaceholder}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute    bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                                Stylish Choice
                            </h6>
                            <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                                Find frames that match your personality and elevate your look effortlessly.
                            </span>

                        </div>
                    </div>
                    
                </div>
            </div>
            <div className='w-[35.625vw] h-[34.25vw] overflow-hidden rounded-[3.125vw]'>
                <img className='h-full w-full' src={categoryPlaceholder} alt="placeholder"></img>
            </div>
            <div className='w-[12.875vw] h-[34.25vw] overflow-hidden rounded-[3.125vw]'>
                <img className='h-full w-full' src={categoryPlaceholder} alt="placeholder"></img>
            </div>            
        </div>
    );
};
