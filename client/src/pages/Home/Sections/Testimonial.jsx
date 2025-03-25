import React,{useState,useEffect} from 'react';
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
        const [screenWidth, setScreenWidth] = useState(null);
    
        useEffect(() => {
          // Set initial width
          setScreenWidth(window.innerWidth);
      
          // Handle window resize
          const handleResize = () => {
            setScreenWidth(window.innerWidth);
          };
      
          // Add event listener
          window.addEventListener("resize", handleResize);
      
          // Cleanup event listener on unmount
          return () => {
            window.removeEventListener("resize", handleResize);
          };
        }, []);
    const customTestimonialVideoDiv=screenWidth>768?"absolute top-0 shape-div2":"absolute top-0 shape-div2Mobile"
    const customTestimonialTextDiv=screenWidth>768?"shape-div flex flex-col py-[4.5vw] px-[4.5vw] md:py-[1vw] md:px-[2vw] gap-[3.5vw] md:gap-[1vw] ":"shape-divMobile flex flex-col py-[4.5vw] px-[4.5vw] md:py-[1vw] md:px-[2vw] gap-[3.5vw] md:gap-[1vw] "

    return (
        <div className='py-[6vw] md:py-[7vw] md:px-[4vw] flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw] w-full  md:h-[60.8125vw]  '>
             <div className='relative w-full h-[91vw] md:w-[46.6875vw] md:h-[46.8125vw] shadow-[0px_1.9439252614974976px_15.55px_rgba(0,_0,_0,_0.25)]  overflow-hidden rounded-[5.5vw] md:rounded-[3.125vw]'>
                <img className='h-full w-full relative' src={categoryPlaceholder}></img>
                <div className={customTestimonialVideoDiv}>
                <div className="mx-[2.75vw] md:mx-[2.5vw] my-[2.5vw] md:my-[1.5vw] relative leading-[110%] font-dyeLine font-bold text-black text-left inline-block text-[24px] md:text-h1Text">
                    <p className="m-0">Hear From Our</p>
                    <p className="m-0 text-[40px] md:text-testimonial">
                    <span className="text-h1Text whitespace-pre-wrap">{`   `}</span>
                    <span>Costumers</span>
                    </p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-[6vw] md:gap-[2vw] h-[166vw] md:h-[46.8125vw] w-full md:w-[38vw] overflow-y-auto hide-scrollbar'>
            {
                testimonials.map((testimonial,index)=>(
                    <div className='relative w-full md:w-[38vw] '>
                        <div className={customTestimonialTextDiv}>
                            <div className='flex flex-row gap-[.5vw] md:gap-[.25vw]'>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                            </div>
                            <div className='h-full  flex flex-col '>
                                <span className='font-roboto leading-[130%] text-[10px] md:text-mediumText line-clamp-4'>
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique."
                                </span>
                            </div>
                            
                            <div className='flex flex-row gap-[2.75vw] md:gap-[1.25vw] items-center'>
                                <img src={blogPlaceholder} className='w-[8vw] h-[8vw] md:w-[3.5vw] md:h-[3.5vw]'></img>
                                <span className='text-[9px] md:text-smallText font-semibold font-roboto'>Name Surname</span>
                            </div>

                        </div>
                        <IconButton className='absolute bottom-0 right-0' btnSizePhone={7} paddingPhone={1} iconWidthPhone={14} btnSize={3} iconWidth={2.1875} padding={0.75}/>
                    </div>
                  

                )
              )
              }
            </div>

        </div>
    );
};
