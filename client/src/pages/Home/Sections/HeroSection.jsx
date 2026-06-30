import { useState, useEffect, useRef, useCallback } from 'react';
import heroSectionBanner from '../../../assets/images/homePage/homePageBanner.png';
import heroSection from '../../../assets/images/heroBanner.png';
import heroSectionBanner2 from '../../../assets/images/newHeader.png';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton, TitleButton } from '../../../components/button';
import { TransitionLink } from '@/Routes/TransitionLink';

const slides = [
    {
        desktop: heroSectionBanner,
        mobile: heroSection,
        showOverlay: true,
        link: '/shop/sunglasses/bestsellers',
    },
    {
        desktop: heroSectionBanner2,
        mobile: heroSectionBanner2,
        showOverlay: false,
        link: '/shop',
    },
    // {
    //     desktop: shopBanner1,
    //     mobile: shopBanner1,
    //     showOverlay: false,
    //     link: '/shop/sunglasses/bestsellers',
    // },
];

const AUTOPLAY_DELAY = 5000;

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    // const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [loadedSlides, setLoadedSlides] = useState({ 0: false });
    const timerRef = useRef(null);

    // useEffect(() => {
    //     const handleResize = () => setScreenWidth(window.innerWidth);
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    const goTo = useCallback((index) => {
        setCurrent((index + slides.length) % slides.length);
    }, []);

    const startAutoplay = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, AUTOPLAY_DELAY);
    }, []);

    useEffect(() => {
        startAutoplay();
        return () => clearInterval(timerRef.current);
    }, [startAutoplay]);

    const handlePrev = () => {
        goTo(current - 1);
        startAutoplay();
    };

    const handleNext = () => {
        goTo(current + 1);
        startAutoplay();
    };

    const handleDot = (index) => {
        goTo(index);
        startAutoplay();
    };

    const markLoaded = (index) => {
        setLoadedSlides((prev) => ({ ...prev, [index]: true }));
    };


    return (
        <div className='relative overflow-hidden mx-[-5vw] bg-offwhitebg md:mx-[-2vw]'>
            {/* Desktop / Tablet */}
            <div className='hidden md:block relative h-[calc(100vh-4.5vw)] min-h-[600px] max-h-[800px] w-full'>
                {/* Slide strip */}
                <div
                    className='flex h-full transition-transform duration-700 ease-in-out'
                    style={{ transform: `translateX(-${current * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
                >
                    {slides.map((slide, i) => (
                        <div key={i} className='relative h-full flex-shrink-0' style={{ width: `${100 / slides.length}%` }}>
                            {!loadedSlides[i] && (
                                <div className='absolute inset-0 bg-gray-200 animate-pulse' />
                            )}
                            <img
                                className='h-full w-full object-cover clickable'
                                src={slide.desktop}
                                alt={`Hero Banner ${i + 1}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                fetchPriority={i === 0 ? 'high' : 'low'}
                                onLoad={() => markLoaded(i)}
                                style={{ opacity: loadedSlides[i] ? 1 : 0, transition: 'opacity 0.3s', objectPosition: 'center' }}
                            />
                            <div className='absolute inset-0 bg-black/10' />
                            {slide.showOverlay && (
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
                                        <TransitionLink to={slide.link}>
                                            <div className='flex gap-[.1vw] group hover:cursor-pointer hover:scale-105 transition-transform duration-700'>
                                                <div>
                                                    <TitleButton
                                                        btnTitle={'Shop'}
                                                        btnRadius={3.125}
                                                        btnHeight={4.25}
                                                        btnWidth={16}
                                                        className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'
                                                        className2='group-hover:text-black'
                                                    />
                                                    <p className='text-regularText pt-[.875vw] pl-[.5vw] font-roboto text-center leading-[150%] text-white'>
                                                        Learn More
                                                    </p>
                                                </div>
                                                <IconButton
                                                    btnSize={4.25}
                                                    iconWidth={1.875}
                                                    padding={0.85}
                                                    className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'
                                                />
                                            </div>
                                        </TransitionLink>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Prev / Next arrows */}
                <div className='absolute right-[4vw] top-[3vw] flex gap-2 z-10'>
                    <button
                        onClick={handlePrev}
                        aria-label='Previous slide'
                        className='bg-btngrery rounded-full p-[0.25vw] cursor-pointer hover:bg-black transition-colors flex items-center justify-center'
                    >
                        <ArrowBackIosRoundedIcon style={{ color: 'white', fontSize: '1.875vw' }} />
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label='Next slide'
                        className='bg-black rounded-full p-[0.25vw] cursor-pointer hover:bg-btngrery transition-colors flex items-center justify-center'
                    >
                        <ArrowForwardIosRoundedIcon style={{ color: 'white', fontSize: '1.875vw' }} />
                    </button>
                </div>

                {/* Dot indicators */}
                <div className='absolute bottom-[2vw] left-1/2 -translate-x-1/2 flex gap-2 z-10'>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDot(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? 'bg-white w-6 h-2.5'
                                    : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile */}
            <div className='md:hidden relative h-[100vw] w-full overflow-hidden'>
                <div
                    className='flex h-full transition-transform duration-700 ease-in-out'
                    style={{ transform: `translateX(-${current * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
                >
                    {slides.map((slide, i) => (
                        <div key={i} className='relative h-full flex-shrink-0' style={{ width: `${100 / slides.length}%` }}>
                            {!loadedSlides[i] && (
                                <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-[2.5vw]' />
                            )}
                            <img
                                className='h-full w-full object-cover rounded-[2.5vw] clickable'
                                src={slide.mobile}
                                alt={`Hero Banner ${i + 1}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                fetchPriority={i === 0 ? 'high' : 'low'}
                                onLoad={() => markLoaded(i)}
                                style={{ opacity: loadedSlides[i] ? 1 : 0, transition: 'opacity 0.3s', objectPosition: 'center' }}
                            />
                            <div className='absolute inset-0 bg-black/10 rounded-[2.5vw]' />
                            {slide.showOverlay && (
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
                                    <div className='flex flex-col items-center'>
                                        <TransitionLink to={slide.link}>
                                            <div className='flex gap-[.4vw] group cursor-pointer scale-100 active:scale-95 transition-transform duration-300'>
                                                <div>
                                                    <TitleButton
                                                        btnTitle={'Shop'}
                                                        btnRadiusPhone={9}
                                                        btnHeightPhone={12.5}
                                                        btnWidthPhone={47}
                                                        className='group-active:text-black group-active:bg-btnHoverColour transition-all duration-300'
                                                        className2='group-active:text-black'
                                                    />
                                                    <p className='text-regularTextPhone pt-[3.5vw] pl-[2vw] font-roboto text-center leading-[150%] text-white'>
                                                        Learn More
                                                    </p>
                                                </div>
                                                <IconButton
                                                    btnSizePhone={12.5}
                                                    iconWidthPhone={20}
                                                    paddingPhone={1}
                                                    className='group-active:text-black group-active:bg-btnHoverColour transition-all duration-300'
                                                />
                                            </div>
                                        </TransitionLink>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile dot indicators */}
                <div className='absolute bottom-[3vw] left-1/2 -translate-x-1/2 flex gap-[1.5vw] z-10'>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDot(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? 'bg-white w-[5vw] h-[2vw]'
                                    : 'bg-white/50 w-[2vw] h-[2vw] hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
