import React,{useState} from 'react';
import categoryPlaceholder from '../../../assets/images/categoryPlaceholder.png';
import { IconButton } from '../../../components/button';
import DiscoverMain1 from '../../../assets/images/homePage/DiscoverMain1.png';
import DiscoverMain2 from '../../../assets/images/homePage/DiscoverMain2.png';
import DiscoverMain3 from '../../../assets/images/homePage/DiscoverMain3.png';
export default function Discover(){
    const [hovered, setHovered] = useState(1);
    const [selected, setSelected] = useState(false);
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
                        <img className='w-full h-full' src={categoryPlaceholder}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                            <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                                Global Brands
                            </h6>
                            <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                                Featuring renowned names like Ray-Ban, Oakley, and Gucci for every eyewear enthusiast.
                            </span>

                        </div>
                    </div>

                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                        <img className='w-full h-full' src={categoryPlaceholder}/>
                        <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                        <div className='absolute    bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
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
                <div
    className={`relative transition-all duration-500 ${
        !selected
            ? hovered == 2
                ? "w-[12.875vw]"
                : "w-[35.625vw]"
            : "w-[0vw]"
    } h-[34.25vw] overflow-hidden rounded-[3.125vw]`}
>
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0 pointer-events-none"></div>

    {/* Image */}
    <img
        className="h-full w-full object-cover"
        src={DiscoverMain1}
        alt="placeholder"
    />
</div>


                {/* Second Div */}
                <div
    onMouseEnter={() => setHovered(2)}
    onMouseLeave={() => setHovered(1)}
    onClick={() => setSelected(!selected)}
    className={`relative transition-all duration-500 ${
        !selected
            ? hovered == 2
                ? "w-[35.625vw]"
                : " w-[12.875vw] "
            : hovered == 3
            ? "w-[12.875vw]"
            : "w-[35.625vw]"
    } h-[34.25vw] overflow-hidden rounded-[3.125vw]`}
>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/0 pointer-events-none"></div>
    <img
        className="h-full w-full object-cover cursor-pointer"
        src={DiscoverMain2}
        alt="placeholder"
    />
</div>

<div
    onMouseEnter={() => setHovered(3)}
    onMouseLeave={() => setHovered(0)}
    className={`relative transition-all duration-500 ${
        selected
            ? hovered == 3
                ? "w-[35.625vw]"
                : "w-[12.875vw]"
            : "w-[0vw]"
    } h-[34.25vw] overflow-hidden rounded-[3.125vw]`}
>
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/0 pointer-events-none"></div>

    {/* Image */}
    <img
        className="h-full w-full object-cover"
        src={DiscoverMain3}
        alt="placeholder"
    />
</div>



                
                </div>
         
        </div>
    );
};
