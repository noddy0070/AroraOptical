import React from 'react';
import { Draggable } from "react-draggable";
import { IconButton, TitleButton } from '../../../components/button';
import MenPlaceholder from '../../../assets/images/homePage/Men.png';
import WomenPlaceholder from '../../../assets/images/homePage/Women.png';
import KidsPlaceholder from '../../../assets/images/homePage/Kids.png';
import AccessoriesPlaceholder from '../../../assets/images/homePage/Accessories.png';
const CategoriesData = [
    { src: MenPlaceholder, alt:"Men",title:"Men"},
    { src: WomenPlaceholder, alt:"Women",title:"Women"},
    { src: KidsPlaceholder, alt:"Kids",title:"Kids"},
    { src: AccessoriesPlaceholder, alt:"Accessories",title:"Accessories"},
    
]

export default function Categories(){
  
    return (
        <div className='pt-[7vw]  mx-[-2vw] overflow-hidden '>
            <div className='flex justify-center  '>
                <h2 className='text-h2Text  leading-[120%] text-center font-dyeLine font-bold'>Fresh arrivals and new<br/> selections</h2>
            </div>

            <div className="w-full pt-[4vw] pb-[7vw] flex flex-row gap-[1vw] overflow-x-auto hide-scrollbar px-[2vw]">
              {
                CategoriesData.map((category,index)=>(
                  <div className=" relative overflow-hidden group min-w-[27.125vw] shadow-[0px_16px_16px_-8px_rgba(12,_12,_13,_0.1),_0px_4px_4px_-4px_rgba(12,_12,_13,_0.05)] hover:shadow-[0px_3.8834950923919678px_9.71px_rgba(0,_0,_0,_0.75)]  h-[31.5625vw] rounded-[2vw] ">
                <img className="w-full h-full rounded-[2vw]  transform group-hover:scale-110 transition-all duration-700"  src={category.src} alt={category.alt} />

                <TitleButton className='absolute bottom-[1vw] left-[1vw]' btnHeight={4.25} btnWidth={10.5} btnRadius={3.125} btnTitle={category.title}/>
                <IconButton className='absolute top-[1vw] right-[1vw]' btnSize={3.0625} padding={.85} iconWidth={2.1875}/>
              </div>
                )
              )
              }
            </div>
        </div>
    );
};
