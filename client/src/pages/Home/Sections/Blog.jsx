import React from 'react';
import categoryPlaceholder from '../../../assets/images/CategoryPlaceholder.png';
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
        <div className='py-[6vw] md:py-[7vw]  mr-[-6vw] md:mr-0 md:pl-[4vw] md:w-full '>
            <div className='flex flex-col-reverse  md:flex-row items-center gap-[8vw] md:gap-[4vw] h-full'>
                <div className='flex flex-col md:w-[26.5vw] mr-[6vw] md:mr-0 h-full justify-center gap-[4vw]  md:gap-[1.5vw]'>
                        <h2 className='text-center  md:text-left font-dyeLine font-bold leading-[120%]   text-[30px] md:text-h2Text'>
                            Educate yourself for your fashion and eyewear needs
                        </h2>
                        <span className='text-center md:text-left font-roboto justify-end text-[12px] md:text-mediumText '>
                            Purchasing eyewear online is simple and convenient. Follow these easy steps to find your perfect pair.
                        </span>
                         <div className='flex flex-row md:mt-[1vw] w-min group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 gap-[.1vw] mx-auto '>
                            <TitleButton btnTitle={"Shop"} btnHeightPhone={12.5} btnWidthPhone={47}  btnRadiusPhone={9}  btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                            <IconButton btnSizePhone={12.5} iconWidthPhone={20} paddingPhone={1} btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                        </div>
                </div>
                <div className='w-full md:w-[61.5vw]  h-full flex flex-row   gap-[2vw] overflow-x-auto hide-scrollbar'>
                {
                BlogData.map((blog,index)=>(
                  <div className="relative min-w-[63.5vw] h-[77.25vw] rounded-[7.5vw]  md:min-w-[27.125vw]  md:h-[31.5625vw] md:rounded-[2vw] overflow-hidden">
                <img className="w-full h-full "  src={blog.src} alt={blog.alt} />

                <IconButton className='absolute m-[4vw] md:m-[1.5vw] top-[0vw] right-[0vw]' btnSizePhone={8} paddingPhone={1} iconWidthPhone={16} btnSize={3.0625} padding={.85} iconWidth={2.1875}/>

                <div className='absolute bottom-[0vw] font-roboto left-[0vw] m-[5vw] md:m-[2vw] '>
                    <div className='mb-[3.5vw] md:mb-[1.5vw]'>

                        <h6 className=' leading-[150%]  font-medium text-[10px] md:text-smallText'>
                            Category
                        </h6>
                        <h5 className='leading-[140%] font-bold text-[14px] md:text-h5Text'>
                            Blog title heading will go here
                        </h5>
                        <span className='leading-[150%] font-roboto text-[12px] md:text-regularText  '>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                        </span>
                    </div>
                    <div className='flex flex-row gap-[2.5vw] md:gap-[1vw]'>
                        <img className='md:w-[3vw] md:h-[3vw] w-[7.5vw] h-[7.5vw] border-solid border-[1px] rounded-full  border-black ' src={blogPlaceholder} alt="blogPlaceholder"/>
                        <div>
                            <span className='font-roboto leading-[150%] text-[8px] md:text-smallText font-medium  '>Full Name</span>
                            <div className='flex flex-row font-roboto text-[8px] md:text-smallText leading-[150%] gap-[1vw] md:gap-[.5vw]'>
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
