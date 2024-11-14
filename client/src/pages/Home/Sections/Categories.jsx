import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import { IconButton, TitleButton } from '../../../components/button';
const CategoriesData = [
    { src: categoryPlaceholder, alt:"men",title:"men"},
    { src: categoryPlaceholder, alt:"women",title:"women"},
    { src: categoryPlaceholder, alt:"kids",title:"kids"},
    { src: categoryPlaceholder, alt:"accessories",title:"accessories"},
    
]

export default function Categories(){
    return (
        <div className='py-[7vw]  mx-[-2vw] overflow-hidden '>
            <div className='flex justify-center pb-[4vw] '>
                <h2 className='text-h2Text  leading-[120%] text-center font-dyeLine font-bold'>Fresh arrivals and new<br/> selections</h2>
            </div>

            <div className="w-full  flex flex-row gap-[1vw] overflow-x-auto hide-scrollbar px-[2vw]">
              {
                CategoriesData.map((category,index)=>(
                  <div className="relative min-w-[27.125vw]  h-[31.5625vw] rounded-[2vw] overflow-hidden">
                <img className="w-full h-full "  src={category.src} alt={category.alt} />

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
