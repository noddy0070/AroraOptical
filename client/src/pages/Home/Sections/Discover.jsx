import React,{useState,useEffect} from 'react';
import { IconButton } from '../../../components/button';
import { motion } from "framer-motion";
import DiscoverMain1 from '../../../assets/images/homePage/DiscoverMain1.png';
import DiscoverMain2 from '../../../assets/images/homePage/DiscoverMain2.png';
import DiscoverMain3 from '../../../assets/images/homePage/DiscoverMain3.png';
import DiscoverSide1 from '../../../assets/images/homePage/DiscoverSide1.png';
import DiscoverSide2 from '../../../assets/images/homePage/DiscoverSide2.png';
export default function Discover(){
    const [hovered, setHovered] = useState(1);
    const [selected, setSelected] = useState(false);

    

  // Compute width (in vw) based on the index, selected state, and hovered value.
  const computeWidth = (index) => {
    // When not selected:
    // - First Div (index 0): big unless hovered over the middle, then small.
    // - Second Div (index 1): big when hovered, else small.
    // - Third Div (index 2): hidden (0vw).
    if (!selected) {
      if (index === 0) return hovered === 2 ? "12.875vw" : "35.625vw";
      if (index === 1) return hovered === 2 ? "35.625vw" : "12.875vw";
      if (index === 2) return "0vw";
    }
    // When selected:
    // - First Div is hidden.
    // - Second Div: big unless the third div is hovered.
    // - Third Div: becomes visible and big when hovered.
    if (selected) {
      if (index === 0) return "0vw";
      if (index === 1) return hovered === 3 ? "12.875vw" : "35.625vw";
      if (index === 2) return hovered === 3 ? "35.625vw" : "12.875vw";
    }
  };

  const computeWidthPhone = (index) => {
    // When not selected:
    // - First Div (index 0): big unless hovered over the middle, then small.
    // - Second Div (index 1): big when hovered, else small.
    // - Third Div (index 2): hidden (0vw).
    if (!selected) {
      if (index === 0) return hovered === 2 ? "23.5vw" : "64.75vw";
      if (index === 1) return hovered === 2 ? "64.75vw" : "23.5vw";
      if (index === 2) return "0vw";
    }
    // When selected:
    // - First Div is hidden.
    // - Second Div: big unless the third div is hovered.
    // - Third Div: becomes visible and big when hovered.
    if (selected) {
      if (index === 0) return "0vw";
      if (index === 1) return hovered === 3 ? "23.5vw" : "64.75vw";
      if (index === 2) return hovered === 3 ? "64.75vw" : "23.5vw";
    }
  };
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
  

    return (
        <div className=' md:pl-[4vw] pb-[6vw] md:pb-[7vw] flex flex-col md:flex-row gap-[4vw] md:gap-[1vw]'>
            <div className='relative   flex flex-row md:flex-col gap-[2vw] md:justify-between  md:h-auto'>
              <div className='mx-[4.25vw] md:mx-0 md:w-[41.625vw] text-center md:text-left'>
                <h1 className='font-dyeLine leading-[120%] text-h6TextPhone md:text-h3Text  md:leading-[120%] lg:leading-[120%]  font-bold mb-[2vw] md:mb-[.5vw] lg:mb-[1.5vw]'>
                    Discover Our Exclusive <br className='block md:hidden'/>Collection of International <br className='block md:hidden'/>Eyewear Brands Today!
                </h1>
                <span className='font-roboto md:text-mediumText hidden lg:block'> 
                Explore a diverse range of eyewear from top international brands that blend style and quality. Our curated selection ensures you find the perfect pair for any occasion.
                </span>
                <span className='font-roboto text-[14px] md:text-mediumText lg:hidden '> 
                Explore a diverse range of eyewear from top international brands that blend style and quality.
                </span>
                </div>
                <div className='hidden md:flex w-[45vw] mr-[-5vw] md:mr-0 overflow-x-auto md:w-auto  flex-row gap-[3.5vw] md:gap-[1.5vw] bottom-0 h-[44.25vw]  md:h-[18.75vw]     '>
                    <div className='relative flex-shrink-0 w-[38.25vw] h-[44.25vw] md:w-[16.125vw] md:h-[18.75vw] rounded-[2.5vw] md:rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={DiscoverSide1}/>
                        <IconButton btnSizePhone={6} iconWidthPhone={14} paddingPhone={1} btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[1.75vw] top-[1.75vw] md:right-[.75vw] md:top-[.75vw]'/>
                        <div className='absolute z-[10] text-white bottom-[2vw] md:bottom-[.75vw] left-[2.5vw] md:left-[.75vw] md:w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-[11px] md:text-h6Text'>
                                Global Brands
                            </h6>
                            <span className='sm:block md:hidden lg:block leading-[120%] md:leading-[150%] font-roboto text-[9px] md:text-regularText'>
                                Featuring renowned names like Ray-Ban, Oakley, and Gucci for every eyewear enthusiast.
                            </span>

                        </div>
                    </div>

                    <div className='relative flex-shrink-0 w-[38.25vw] h-[44.25vw] md:w-[16.125vw] md:h-[18.75vw] rounded-[2.5vw] md:rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={DiscoverSide2}/>
                        <IconButton btnSizePhone={6} iconWidthPhone={14} paddingPhone={1} btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[1.75vw] top-[1.75vw] md:right-[.75vw] md:top-[.75vw]'/>
                        <div className='absolute z-[10] text-white bottom-[2vw] md:bottom-[.75vw] left-[2.5vw] md:left-[.75vw] md:w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-[11px] md:text-h6Text'>
                                Stylish Choice
                            </h6>
                            <span className='sm:block md:hidden lg:block leading-[120%] md:leading-[150%] font-roboto text-[9px] md:text-regularText'>
                                Find frames that match your personality and elevate your look effortlessly.
                            </span>

                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="flex    w-full md:w-[49.5vw] rounded-[3.125vw] overflow-x-auto hide-scrollbar">
      {/* First Div */}
      <motion.div
        className="relative  h-[62.25vw] md:h-[34.25vw] overflow-hidden rounded-[5.5vw] md:rounded-[3.125vw]"
        animate={{minWidth:screenWidth>768? computeWidth(0):computeWidthPhone(0) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        // onMouseEnter={() => setHovered(2)}
        // onMouseLeave={() => setHovered(1)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0 pointer-events-none" />
        <img className="h-full w-full object-cover" src={DiscoverMain1} alt="placeholder" />
      </motion.div>

      {/* Second Div */}
      <motion.div
        className="relative h-[62.25vw] md:h-[34.25vw] overflow-hidden rounded-[5.5vw] md:rounded-[3.125vw] cursor-pointer"
        animate={{ minWidth:screenWidth>768? computeWidth(1):computeWidthPhone(1), marginLeft: screenWidth>768?"1vw":"1.84vw" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(2)}
        onMouseLeave={() => setHovered(1)}
        onClick={() => setSelected(!selected)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0 pointer-events-none" />
        <img className="h-full w-full object-cover" src={DiscoverMain2} alt="placeholder" />
      </motion.div>

      {/* Third Div */}
      <motion.div
        className="relative  h-[62.25vw] md:h-[34.25vw] overflow-hidden rounded-[5.5vw] md:rounded-[3.125vw] "
        animate={{ minWidth:screenWidth>768? computeWidth(2):computeWidthPhone(2), marginLeft: screenWidth>768?"1vw":"1.84vw" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(3)}
        onMouseLeave={() => setHovered(1)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/0 pointer-events-none" />
        <img className="h-full w-full object-cover" src={DiscoverMain3} alt="placeholder" />
      </motion.div>
    </div>
         
        </div>
    );
};
