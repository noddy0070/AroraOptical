import React from 'react';
import { IconButton, TitleButton } from '../../../components/button';
import CategoryPlaceholder from '../../../assets/images/CategoryPlaceholder.png';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import TrendingImg from '../../../assets/images/homePage/Trending.png';
export default function Trending(){
    return (
        <div className=' md:px-[4vw] py-[5vw] md:py-[7vw] gap-[6vw] md:gap-0 flex flex-col-reverse md:grid  md:grid-cols-2 '>
            <div className="relative  bg-transparent md:col-span-1 rounded-[4vw] md:rounded-none md:rounded-l-[3.125vw] overflow-hidden">
                <img className="h-auto w-full " src={TrendingImg} alt="Category Placeholder" />
                <ArrowBackIosRoundedIcon className='hidden absolute md:bottom-[2vw] md:right-[3.75vw] bg-btngrery rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowBackIosRoundedIcon>
                <ArrowForwardIosRoundedIcon className=' hidden absolute md:bottom-[2vw] md:right-[1.5vw] bg-black rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowForwardIosRoundedIcon>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(126,126,126,0.37)] via-transparent to-transparent"></div>
            </div>

            <div className='md:col-span-1 h-full'>
                <div className='px-[4vw] flex flex-col justify-center gap-[2vw] md:gap-[1vw] items-center h-full'>
                    <button className=' rounded-[6vw] md:rounded-[3.125vw] w-[21vw] md:w-[10.5vw] h-[8vw] md:h-[4vw]  border-solid border-black border-[1px]'>
                        <span className='font-roboto text-[12px] md:text-regularText'>Offers</span>
                    </button>
                    <h3 className='text-center font-dyeLine justify-center leading-[120%] text-h4TextPhone md:text-h3Text'>
                            Trending Offers and <br/>Collection awaits

                    </h3>
                    <span className='text-center font-roboto justify-end text-[14px] md:text-regularText '>
                    Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Norem ipsum dolor sit amet, consectetur 
                    </span>
                    <div className='flex flex-row justify-center group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 gap-[.1vw] '>
                        <TitleButton btnHeightPhone={12.5} btnRadiusPhone={9} btnWidthPhone={47} btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                        <IconButton btnSizePhone={12.5} iconWidthPhone={20} paddingPhone={1} btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                    </div>
                </div>
            </div>
        </div>
    );
};
