import React,{useState,useEffect} from 'react';
import heroSectionBanner from '../../../assets/images/homePage/homePageBanner.png';
import heroSection from '../../../assets/images/heroBanner.png';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton, TitleButton } from '../../../components/button';

export default function HeroSection(){
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
    const heroSectionImage=screenWidth>768?heroSectionBanner:heroSection
    return (
        <div className='flex flex-row md:relative md:py-0 py-[5vw]  md:h-full md:w-full overflow-x-auto gap-[2.5vw] hide-scrollbar mr-[-5vw] md:mr-0 md:overflow-x-hidden  rounded-[2.5vw]  md:rounded-[1.875vw] overflow-hidden text-white '>
            <div className='relative w-[57.5vw] md:w-full flex-shrink-0'>
            <img className='h-full w-full rounded-[2.5vw]  md:rounded-[1.875vw]' src={heroSectionImage}   />
            <div className='absolute top-0 left-0 w-full h-full md:h-full md:w-full px-[3.75vw] md:px-[4vw] py-[7vw] md:py-[3vw] '>
                <div className='relative w-full ' >
                    <div className='absolute w-full h-full md:w-[39.875vw] left-0'>
                        <h1 className=' font-dyeLine text-[24px] md:text-h1Text font-bold  leading-[120%] pb-[3.5vw] md:pb-[1.5vw]'>Experience the Best of Both Worlds</h1>
                        <span className='font-roboto  overflow-hidden text-[12px] md:text-mediumText     '>Discover our curated collection of eyewear, blending the convenience 
                            of online shopping with the personalized service of our physical store. 
                            Whether you're browsing from home or visiting us in person, we ensure a seamless experience tailored just for you.</span>
                    </div>
                    <div className='relative hidden md:block'>
                    <ArrowBackIosRoundedIcon className='absolute right-[2.25vw] bg-btngrery rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowBackIosRoundedIcon>
                    <ArrowForwardIosRoundedIcon className=' absolute right-[0vw] bg-black rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowForwardIosRoundedIcon>
                    </div>
                </div>
                <div className=''>
                <div className='absolute  bottom-0 py-[5.5vw] md:pb-[3vw]  md:w-full md:pr-[4vw] scale-100 '>
                    <div className=' flex-row hidden md:flex gap-[.1vw] justify-center w-min mx-auto group hover:cursor-pointer hover:scale-105 transition-transform duration-700 '>
                        <TitleButton  btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25}  btnWidth={16} className= 'group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                        <IconButton btnSize={4.25} iconWidth={1.875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                    </div>
                    <p className='text-[9px]  md:text-regularText md:pt-[.875vw] font-roboto   text-center leading-[150%]'>Learn More</p>

                </div>
                </div>

            </div>
            </div>
            <div className='relative w-[57.5vw] md:w-full md:hidden flex-shrink-0'>
            <img className='h-full w-full rounded-[2.5vw]  md:rounded-[1.875vw]' src={heroSectionImage}   />
            <div className='absolute top-0 left-0 w-full h-full md:h-full md:w-full px-[3.75vw] md:px-[4vw] py-[7vw] md:py-[3vw] '>
                <div className='relative w-full ' >
                    <div className='absolute w-full h-full md:w-[39.875vw] left-0'>
                        <h1 className=' font-dyeLine text-[24px] md:text-h1Text font-bold  leading-[120%] pb-[3.5vw] md:pb-[1.5vw]'>Experience the Best of Both Worlds</h1>
                        <span className='font-roboto  overflow-hidden text-[12px] md:text-mediumText     '>Discover our curated collection of eyewear, blending the convenience 
                            of online shopping with the personalized service of our physical store. 
                            Whether you're browsing from home or visiting us in person, we ensure a seamless experience tailored just for you.</span>
                    </div>
                    <div className='relative hidden md:block'>
                    <ArrowBackIosRoundedIcon className='absolute right-[2.25vw] bg-btngrery rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowBackIosRoundedIcon>
                    <ArrowForwardIosRoundedIcon className=' absolute right-[0vw] bg-black rounded-full p-[0.25vw]' style={{ color: 'white', fontSize: "1.875vw" }}></ArrowForwardIosRoundedIcon>
                    </div>
                </div>
                <div className=''>
                <div className='absolute  bottom-0 py-[5.5vw] md:pb-[3vw]  md:w-full md:pr-[4vw] scale-100 '>
                    <div className=' flex-row hidden md:flex gap-[.1vw] justify-center w-min mx-auto group hover:cursor-pointer hover:scale-105 transition-transform duration-700 '>
                        <TitleButton  btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25}  btnWidth={16} className= 'group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                        <IconButton btnSize={4.25} iconWidth={1.875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                    </div>
                    <p className='text-[9px]  md:text-regularText md:pt-[.875vw] font-roboto   text-center leading-[150%]'>Learn More</p>

                </div>
                </div>

            </div>
            </div>
            
        </div>
    );
};
