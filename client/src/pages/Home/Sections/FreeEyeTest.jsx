import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import { IconButton,TitleButton } from '../../../components/button';
export default function FreeEyeTest(){
    return (
        <div className='py-[7vw] px-[2vw] h-[42.75vw] '>
            <div className='flex flex-row h-full gap-[.625vw]'>
                <div className='ml-[2.25vw] w-[28.75vw] h-[28.75vw] flex flex-col justify-center'>
                    <h2 className='font-dyeLine text-h2Text font-bold mb-[1vw]'>
                        Free Eye Test <br/>for You
                    </h2>
                    <span className='font-roboto text-regularText mb-[2vw]'>
                    Book your free eye test today! Experience the same exceptional service our local customers love—now available nationwide.
                    </span>
                    <div className='flex flex-row justify-center'>
                        <TitleButton btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16}/>
                        <IconButton btnSize={4.25} iconWidth={2.1875} padding={0.85}/>
                    </div>
                </div>

                <div className='relative w-[28.75vw] h-[28.75vw] rounded-[3.125vw] overflow-hidden'>
                        <img className='w-full h-full' src={categoryPlaceholder}/>
                        <div className='absolute right-[1.5vw] top-[1.5vw] flex flex-row items-center gap-[.5vw]' >
                            <span className='text-mediumText text-center font-roboto'>
                                View in Maps
                            </span>
                            <IconButton btnSize={3.0625} iconWidth={2.1875} padding={0.6} className=''/>
                        </div>
                        <div className='absolute bottom-[1.5vw] left-[1.5vw] w-[15.1875vw]'>
                            <h3 className='leading-[120%] font-dyeLine font-bold text-h3Text'>
                                Arora Optical
                            </h3>
                            <h6 className='leading-[150%] font-dyeLine text-h6Text font-bold'>
                                Store Locator
                            </h6>

                        </div>
                </div>
                <div className='w-[28.75vw] flex flex-col    justify-center h-[28.75vw] py-[1vw] mr-[2.25vw] '>
                    <div className=' '>
                    <h3 className='font-dyeLine font-bold text-h3Text mb-[1vw]'>
                        Why Choose Us?
                    </h3>
                    <p className="m-0 ">
                        <div className="text-h5Text leading-[140%] font-bold font-dyeLine">
                            {"Expertise You Can Trust: "}
                            <span className="leading-[150%] font-normal lg:inline hidden text-regularText font-roboto">
                                    With [X] years of experience and a reputation for top-notch service, we’ve helped thousands see better.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden inline text-regularText font-roboto">
                                With [X] years of excellence, we've improved thousands of lives.
                            </span>
                        </div>

                    </p>
                    <p className="m-0 text-[4px] lg:text-regularText leading-[140%] font-dyeLine">&nbsp;</p>
                    <p className="m-0">
                        <div className="text-h5Text leading-[140%] font-bold font-dyeLine">
                            {"Advanced Eye Testing: "}
                            <span className="leading-[150%] font-normal lg:inline hidden text-regularText font-roboto">
                            We offer a comprehensive, no-cost eye test that checks for more than just blurry vision—because good eye health is more than 20/20.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden inline text-regularText font-roboto">
                            Get a free eye test that covers more than just vision.
                            </span>
                        </div>
                    </p>
                    <p className="m-0 text-[4px] lg:text-regularText leading-[140%] font-dyeLine " >&nbsp;</p>
                    <p className="m-0">
                    <div className="text-h5Text leading-[140%] font-bold font-dyeLine">
                            {"Stylish, Affordable Eyewear: "}
                            <span className="leading-[150%] font-normal lg:inline hidden text-regularText font-roboto">
                            Whether you need prescription glasses, trendy frames, or premium lenses, we've got something for every style and budget.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden inline text-regularText font-roboto">
                            From prescription glasses to trendy frames, we have styles for every budget.
                            </span>
                        </div>
                    </p>
                    </div>
                    
                </div>

            </div>
        </div>
    );
};
