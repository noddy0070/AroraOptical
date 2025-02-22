import React,{useState} from 'react';
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

  

    return (
        <div className=' pl-[4vw] py-[7vw] h-[48.25vw] flex flex-row gap-[1vw]'>
            <div className='relative w-[41.625vw]'> 
                <h1 className='font-dyeLine text-h3Text leading-[100%] lg:leading-[120%]  font-bold mb-[.5vw] lg:mb-[1.5vw]'>
                    Discover Our Exclusive Collection of International Eyewear Brands Today!
                </h1>
                <span className='font-roboto text-mediumText hidden lg:block'> 
                Explore a diverse range of eyewear from top international brands that blend style and quality. Our curated selection ensures you find the perfect pair for any occasion.
                </span>
                <span className='font-roboto text-mediumText lg:hidden '> 
                Explore a diverse range of eyewear from top international brands that blend style and quality.
                </span>
                <div className='absolute flex flex-row gap-[1.5vw] bottom-0 md:pt-[1vw]  h-[18.75vw]     '>
                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={DiscoverSide1}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute bottom-[.75vw] text-white left-[.75vw] w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                                Global Brands
                            </h6>
                            <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                                Featuring renowned names like Ray-Ban, Oakley, and Gucci for every eyewear enthusiast.
                            </span>

                        </div>
                    </div>

                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={DiscoverSide2}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute z-[10] text-white bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                                Stylish Choice
                            </h6>
                            <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                                Find frames that match your personality and elevate your look effortlessly.
                            </span>

                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="flex gap-[1vw] w-[49.5vw] rounded-[3.125vw] overflow-hidden">
      {/* First Div */}
      <motion.div
        className="relative h-[34.25vw] overflow-hidden rounded-[3.125vw]"
        animate={{ width: computeWidth(0) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => setHovered(2)}
        onMouseLeave={() => setHovered(1)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0 pointer-events-none" />
        <img className="h-full w-full object-cover" src={DiscoverMain1} alt="placeholder" />
      </motion.div>

      {/* Second Div */}
      <motion.div
        className="relative h-[34.25vw] overflow-hidden rounded-[3.125vw] cursor-pointer"
        animate={{ width: computeWidth(1) }}
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
        className="relative h-[34.25vw] overflow-hidden rounded-[3.125vw]"
        animate={{ width: computeWidth(2) }}
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
