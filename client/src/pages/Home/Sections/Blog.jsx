import React from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import blogPlaceholder from '../../../assets/images/blogPlaceholder.png';
import { IconButton, TitleButton } from '../../../components/button';

const BlogData = [
    { src: categoryPlaceholder, alt:"men",title:"men"},
    { src: categoryPlaceholder, alt:"women",title:"women"},
    { src: categoryPlaceholder, alt:"kids",title:"kids"},
    { src: categoryPlaceholder, alt:"accessories",title:"accessories"},
    
]

export default function Blog(){
    return (
        <div className='py-[7vw]  pl-[4vw] h-[45.625vw] w-full '>
            <div className='flex flex-row gap-[4vw] h-full'>
                <div className='flex flex-col w-[26.5vw]  h-full justify-center  gap-[1.5vw]'>
                        <h2 className='font-dyeLine font-bold leading-[100%] mb-[1vw] text-h2Text'>
                            Educate yourself for your fashion and eyewear needs
                        </h2>
                        <span className=' font-roboto justify-end text-mediumText mb-[1vw]'>
                            Purchasing eyewear online is simple and convenient. Follow these easy steps to find your perfect pair.
                        </span>
                        <div className='flex flex-row'>
                            <TitleButton btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16}/>
                            <IconButton btnSize={4.25} iconWidth={2.1875} padding={0.85}/>
                        </div>
                </div>
                <div className='w-[61.5vw] h-full flex flex-row  gap-[2vw] overflow-x-auto hide-scrollbar'>
                {
                BlogData.map((blog,index)=>(
                  <div className="relative min-w-[27.125vw]  h-[31.5625vw] rounded-[2vw] overflow-hidden">
                <img className="w-full h-full "  src={blog.src} alt={blog.alt} />

                <IconButton className='absolute m-[1.5vw] top-[0vw] right-[0vw]' btnSize={3.0625} padding={.85} iconWidth={2.1875}/>

                <div className='absolute bottom-[0vw] font-roboto left-[0vw] m-[2vw] '>
                    <div className='mb-[1.5vw]'>

                        <h6 className=' leading-[150%]  font-medium text-smallText'>
                            Category
                        </h6>
                        <h5 className='leading-[140%] font-bold text-h5Text'>
                            Blog title heading will go here
                        </h5>
                        <span className='leading-[150%] font-roboto text-regularText  '>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                        </span>
                    </div>
                    <div className='flex flex-row gap-[1vw]'>
                        <img className='w-[3vw] h-[3vw] border-solid border-[1px] rounded-full  border-black ' src={blogPlaceholder} alt="blogPlaceholder"/>
                        <div>
                            <span className='font-roboto leading-[150%] text-smallText font-medium  '>Full Name</span>
                            <div className='flex flex-row font-roboto text-smallText leading-[150%] gap-[.5vw]'>
                                <span >
                                01 Jan 2025
                                </span>
                                <span className='text-[1.125rem]'>
                                •
                                </span>
                                <span>
                                5 min read
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
              </div>
                )
                )
                }

                </div>
            </div>
        </div>
    );
};
