import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import blogPlaceholder from '../../../assets/images/blogPlaceholder.png';
import star from '../../../assets/images/star.png';
import { IconButton, TitleButton } from '../../../components/button';

const testimonials = [
    { src: categoryPlaceholder, alt:"men",title:"men"},
    { src: categoryPlaceholder, alt:"women",title:"women"},
    { src: categoryPlaceholder, alt:"kids",title:"kids"},
    { src: categoryPlaceholder, alt:"accessories",title:"accessories"},
    
]
export default function Testimonial(){
    return (
        <div className='py-[7vw] px-[4vw]b flex flex-row gap-[1.5vw] w-full h-[60.8125vw]  '>
             <div className='relative w-[46.6875vw] h-[46.8125] overflow-hidden rounded-[3.125vw]'>
                <img className='h-full w-full relative' src={categoryPlaceholder}></img>
                <div className='absolute top-0 shape-div2'>
                <div className="mx-[2.5vw] my-[1.5vw] relative leading-[110%] font-dyeLine font-bold text-black text-left inline-block text-h1Text">
                    <p className="m-0">Hear From Our</p>
                    <p className="m-0 text-testimonial">
                    <span className="text-h1Text whitespace-pre-wrap">{` `}</span>
                    <span>Costumers</span>
                    </p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-[2vw] h-[46.8125vw] w-[38vw] overflow-y-auto hide-scrollbar'>
            {
                testimonials.map((testimonial,index)=>(
                    <div className='relative w-[38vw] '>
                        <div className='shape-div flex flex-col py-[1vw] px-[2vw] gap-[1vw] '>
                            <div className='flex flex-row gap-[.25vw]'>
                                <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                                <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                                <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                                <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                                <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                            </div>
                            <div className='h-full    flex flex-col overflow-x-auto '>
                                < div className=' '>
                                    <span className='font-roboto text-mediumText overflow-hidden'>
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique."
                            </span>
                                </div>
                            
                            </div>
                            
                            <div className='flex flex-row gap-[1.25vw] items-center'>
                                <img src={blogPlaceholder} className='w-[3.5vw] h-[3.5vw]'></img>
                                <span className='text-smallText font-semibold font-roboto'>Name Surname</span>
                            </div>

                        </div>
                        <IconButton className='absolute bottom-0 right-0' btnSize={3} iconWidth={2.1875} padding={0.75}/>
                    </div>
                  

                )
              )
              }
            </div>

        </div>
    );
};
