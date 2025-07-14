import React,{useState,useEffect} from 'react';
import heroSectionBanner from '../../../assets/images/homePage/homePageBanner.png';
import heroSection from '../../../assets/images/heroBanner.png';
import heroSectionBanner2 from '../../../assets/images/newHeader.png'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton, TitleButton } from '../../../components/button';
import { TransitionLink } from '@/Routes/TransitionLink';

export default function HeroSection(){
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
        
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const heroSectionImage = screenWidth > 768 ? heroSectionBanner : heroSection;

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    return (
        <div className='relative overflow-hidden mx-[-5vw] bg-offwhitebg md:mx-[-2vw]'>
            {/* Desktop/Tablet View */}
            <div className='hidden md:block relative h-[calc(100vh-4.5vw)]  min-h-[600px] max-h-[800px] w-full'>
                <div className={`w-full h-full transition-opacity  duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                        className='h-full w-full object-cover clickable'
                        src={heroSectionBanner}
                        alt="Hero Banner"
                        loading="eager"
                        fetchpriority="high"
                        onLoad={handleImageLoad}
                        sizes="100vw"
                        style={{
                            aspectRatio: '16/9',
                            objectPosition: 'center'
                        }}
                    />
                </div>
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" 
                         style={{ aspectRatio: '16/9' }}
                    />
                )}
                <div className='absolute inset-0 bg-black/10'></div>
                <div className='absolute inset-0 flex flex-col justify-between px-[4vw] py-[3vw]'>
                    <div className='relative max-w-[39.875vw]'>
                        <h1 className='font-dyeLine text-h1Text font-bold leading-[120%] pb-[1.5vw] text-white'>
                            Experience the Best of Both Worlds
                        </h1>
                        <p className='font-roboto text-mediumText text-white'>
                            Discover our curated collection of eyewear, blending the convenience 
                            of online shopping with the personalized service of our physical store. 
                            Whether you're browsing from home or visiting us in person, we ensure a seamless experience tailored just for you.
                        </p>
                    </div>
                    <div className='flex flex-col items-center'>
                    <TransitionLink to="/shop/sunglasses/bestsellers">

                        <div className='flex gap-[.1vw] group hover:cursor-pointer hover:scale-105 transition-transform duration-700'>
                            <TitleButton
                                btnTitle={"Shop"}
                                btnRadius={3.125}
                                btnHeight={4.25}
                                btnWidth={16}
                                className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'
                                className2='group-hover:text-black'
                            />
                            <IconButton
                                btnSize={4.25}
                                iconWidth={1.875}
                                padding={0.85}
                                className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'
                            />
                        </div>
                        </TransitionLink>

                        <p className='text-regularText pt-[.875vw] font-roboto text-center leading-[150%] text-white'>
                            Learn More
                        </p>
                    </div>
                </div>
                <div className='absolute right-[4vw] top-[3vw] flex gap-2'>
                    <ArrowBackIosRoundedIcon 
                        className='bg-btngrery rounded-full p-[0.25vw] cursor-pointer hover:bg-black transition-colors' 
                        style={{ color: 'white', fontSize: "1.875vw" }}
                    />
                    <ArrowForwardIosRoundedIcon 
                        className='bg-black rounded-full p-[0.25vw] cursor-pointer hover:bg-btngrery transition-colors' 
                        style={{ color: 'white', fontSize: "1.875vw" }}
                    />
                </div>
            </div>

            {/* Mobile View */}
            <div className='md:hidden relative h-[100vw] w-full'>
                <div className={`w-full h-full transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                        className='h-full w-full object-cover rounded-[2.5vw] clickable'
                        src={heroSection}
                        alt="Hero Banner Mobile"
                        loading="eager"
                        fetchpriority="high"
                        onLoad={handleImageLoad}
                        sizes="100vw"
                        style={{
                            aspectRatio: '1/1',
                            objectPosition: 'center'
                        }}
                    />
                </div>
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-[2.5vw]" 
                         style={{ aspectRatio: '1/1' }}
                    />
                )}
                <div className='absolute inset-0 bg-black/10 rounded-[2.5vw]'></div>
                <div className='absolute inset-0 flex flex-col justify-between p-[3.75vw]'>
                    <div>
                        <h1 className='font-dyeLine text-[24px] font-bold leading-[120%] pb-[3.5vw] text-white'>
                            Experience the Best of Both Worlds
                        </h1>
                        <p className='font-roboto text-[12px] text-white'>
                            Discover our curated collection of eyewear, blending the convenience 
                            of online shopping with the personalized service of our physical store. 
                            Whether you're browsing from home or visiting us in person, we ensure a seamless experience tailored just for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};