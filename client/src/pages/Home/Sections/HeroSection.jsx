import React from 'react';
import heroSectionBanner from '../../../assets/images/homePage/homePageBanner.png';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton, TitleButton } from '../../../components/button';

export default function HeroSection(){
    return (
        <div className='relative h-[39.0625vw] rounded-[1.875vw] overflow-hidden text-white '>
            <img className=' h-full w-full' src={heroSectionBanner}   ></img>
            <div className='absolute top-0 left-0 h-full w-full px-[4vw] py-[3vw] '>
                <div className='relative ' >
                    <div className='absolute w-[39.875vw] left-0'>
                        <h1 className=' font-dyeLine text-h1Text font-bold  leading-[120%] pb-[1.5vw]'>Experience the Best of Both Worlds</h1>
                        <span className='font-roboto  overflow-hidden text-mediumText     '>Discover our curated collection of eyewear, blending the convenience 
                            of online shopping with the personalized service of our physical store. 
                            Whether you're browsing from home or visiting us in person, we ensure a seamless experience tailored just for you.</span>
                    </div>
                    <ArrowBackIosRoundedIcon className='absolute right-[2.25vw] bg-btngrery rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowBackIosRoundedIcon>
                    <ArrowForwardIosRoundedIcon className='absolute right-[0vw] bg-black rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowForwardIosRoundedIcon>
                </div>
                <div className='absolute bottom-0 pb-[3vw]  w-full pr-[4vw] scale-100 '>
                    <div className=' flex flex-row gap-[.1vw] justify-center w-min mx-auto group hover:cursor-pointer hover:scale-105 transition-transform duration-700 '>
                        <TitleButton  btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25}  btnWidth={16} className= ' group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                        <IconButton btnSize={4.25} iconWidth={1.875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                    </div>
                    <p className='text-regularText pt-[.875vw] font-roboto  w-full text-center leading-[150%]'>Learn More</p>

                    </div>

            </div>
            
        </div>
    );
};
