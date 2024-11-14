import React from 'react';
import { IconButton, TitleButton } from '../../../components/button';
import CategoryPlaceholder from '../../../assets/images/CategoryPlaceholder.png';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
export default function Trending(){
    return (
        <div className=' px-[4vw] py-[7vw] grid h-[57.875vw] grid-cols-2'>
            <div className="relative bg-blue-200 col-span-1 h-full rounded-l-[3.125vw] overflow-hidden">
    <img className="h-full w-full" src={CategoryPlaceholder} alt="Category Placeholder" />
    <ArrowBackIosRoundedIcon className='absolute bottom-[2vw] right-[3.75vw] bg-btngrery rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowBackIosRoundedIcon>
    <ArrowForwardIosRoundedIcon className='absolute bottom-[2vw] right-[1.5vw] bg-black rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowForwardIosRoundedIcon>
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(126,126,126,0.37)] via-transparent to-transparent"></div>
</div>

            <div className='col-span-1 h-full'>
                <div className='px-[4vw] flex flex-col justify-center items-center h-full'>
                    <button className=' rounded-[3.125vw] w-[10.5vw] h-[4vw] mb-[1.625vw]  border-solid border-black border-[1px]'>
                        <span className='font-roboto text-regularText'>Offers</span>
                    </button>
                    <h3 className='text-center font-dyeLine justify-center leading-[100%] mb-[1vw] text-h3Text'>
                            Trending Offers and <br/>Collection awaits

                    </h3>
                    <span className='text-center font-roboto justify-end text-regularText mb-[1vw]'>
                    Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Norem ipsum dolor sit amet, consectetur 
                    </span>
                    <div className='flex flex-row justify-center'>
                        <TitleButton btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16}/>
                        <IconButton btnSize={4.25} iconWidth={2.1875} padding={0.85}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
