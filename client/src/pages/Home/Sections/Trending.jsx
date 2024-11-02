import React from 'react';
import { IconButton, TitleButton } from '../../../components/button';
import CategoryPlaceholder from '../../../assets/images/CategoryPlaceholder.png';
export default function Trending(){
    return (
        <div className='bg-yellow-200 px-[4vw] py-[7vw] grid h-[57.875vw] grid-cols-2'>
            <div className="relative bg-blue-200 col-span-1 h-full rounded-l-[3.125vw] overflow-hidden">
    <img className="h-full w-full" src={CategoryPlaceholder} alt="Category Placeholder" />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(126,126,126,0.37)] via-transparent to-transparent"></div>
</div>

            <div className='bg-blue-400 col-span-1 h-full'>
                <div className='px-[4vw] flex flex-col justify-center items-center h-full'>
                    <button className=' rounded-[3.125vw] w-[10.5vw] h-[4vw]  border-solid border-black border-[1px]'>
                        <span className='font-roboto text-[1rem]'>Offers</span>
                    </button>
                    <h1 className='text-center font-dyeLine justify-center text-[2.25rem]'>
                            Trending Offers and <br/>Collection awaits

                    </h1>
                    <span className='text-center font-roboto justify-end text-[1rem]'>
                    Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.Norem ipsum dolor sit amet, consectetur 
                    </span>
                    <div className='flex flex-row justify-center'>
                        <TitleButton btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16}/>
                        <IconButton btnSize={4.25} iconWidth={2.1875}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
