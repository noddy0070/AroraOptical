import React, { useState } from 'react';
import { IconButton, TitleButton } from '../../../components/button';
import MenPlaceholder from '../../../assets/images/homePage/Men.png';
import WomenPlaceholder from '../../../assets/images/homePage/Women.png';
import KidsPlaceholder from '../../../assets/images/homePage/Kids.png';
import AccessoriesPlaceholder from '../../../assets/images/homePage/Accessories.png';

const CategoriesData = [
    { src: MenPlaceholder, alt: "Men", title: "Men" },
    { src: WomenPlaceholder, alt: "Women", title: "Women" },
    { src: KidsPlaceholder, alt: "Kids", title: "Kids" },
    { src: AccessoriesPlaceholder, alt: "Accessories", title: "Accessories" },
];

const CategoryCard = ({ category, index }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div 
            key={index} 
            className="relative overflow-hidden group min-w-[43.5vw] md:min-w-[27.125vw] h-[50vw] md:h-[31.5625vw] rounded-[3vw] md:rounded-[2vw] shadow-[0px_16px_16px_-8px_rgba(12,_12,_13,_0.1),_0px_4px_4px_-4px_rgba(12,_12,_13,_0.05)] hover:shadow-[0px_3.8834950923919678px_9.71px_rgba(0,_0,_0,_0.75)]"
            style={{ aspectRatio: 'auto 435/500' }}
        >
            <div className={`w-full h-full transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <img 
                    className="w-full h-full rounded-[3vw] md:rounded-[2vw] transform group-hover:scale-110 transition-all duration-700 object-cover"
                    src={category.src} 
                    alt={category.alt}
                    loading={index <= 1 ? "eager" : "lazy"}
                    fetchpriority={index <= 1 ? "high" : "auto"}
                    onLoad={() => setIsImageLoaded(true)}
                    sizes="(max-width: 768px) 43.5vw, 27.125vw"
                />
            </div>
            
            {!isImageLoaded && (
                <div 
                    className="absolute inset-0 bg-gray-200 animate-pulse rounded-[3vw] md:rounded-[2vw]"
                    style={{ aspectRatio: 'auto 435/500' }}
                />
            )}

            <div className='absolute bottom-0 w-full h-full rounded-[3vw] md:rounded-[2vw]' />
            
            <TitleButton 
                className2='text-[12px] md:text-regularText' 
                className='z-[10] absolute bottom-[2vw] left-[2vw] md:bottom-[1vw] md:left-[1vw]' 
                btnHeightPhone={8} 
                btnRadiusPhone={6} 
                btnWidthPhone={22} 
                btnHeight={4.25} 
                btnWidth={10.5} 
                btnRadius={3.125} 
                btnTitle={category.title}
            />
            
            <IconButton 
                className='z-[10] absolute top-[2vw] md:top-[1vw] right-[2vw] md:right-[1vw] shadow-[0px_1.6006783246994019px_2.4px_rgba(0,_0,_0,_0.4)]'
                btnSizePhone={6} 
                paddingPhone={1} 
                iconWidthPhone={12} 
                btnSize={3.0625} 
                padding={.85} 
                iconWidth={2.1875}
            />
            
            <div 
                className="absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ease-in-out pointer-events-none opacity-50 md:opacity-80 group-hover:opacity-0" 
                style={{ background: 'linear-gradient(to top,rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))' }}
            />
        </div>
    );
};

export default function Categories() {
    return (
        <div className='bg-offwhitebg select-none mx-[-5vw] pt-[6vw] md:pt-[7vw] md:mx-[-2vw] overflow-hidden flex flex-col'>
            <div className='flex justify-center mb-[4vw]'>
                <h2 className='text-h3TextPhone md:text-h2Text leading-[120%] text-center font-dyeLine font-bold'>
                    Fresh arrivals and new<br/> selections
                </h2>
            </div>

            <div className="w-full flex flex-row gap-[1.5vw] md:gap-[1vw] overflow-x-auto overflow-y-hidden pt-0 pb-[6vw] md:pb-[7vw] hide-scrollbar scroll-snap-x px-[5vw] md:px-[2vw]">
                {CategoriesData.map((category, index) => (
                    <CategoryCard key={index} category={category} index={index} />
                ))}
            </div>
        </div>
    );
};
