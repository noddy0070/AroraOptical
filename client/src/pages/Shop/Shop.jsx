import React, { useState, useEffect } from 'react';
import { IconButton } from '../../components/button';
import {product} from '../../data/product.jsx'
import Item from './item';
import Filters from '../../components/Filters.jsx';



const sortOptions=[
    'Price: Low to High',
    'Price: High to Low',
    'Newest Arrivals',
    'Best Sellers'
]


export default function Shop({category,audience}) {
    const [selectedSort, setSelectedSorts] = useState([]);
    const [hoveredSort, setHoveredSort] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

  

    
    const addSort=(sort)=>{
        if(!selectedSort.includes(sort)){
        setSelectedSorts([...selectedSort,sort])
        }else{
            setSelectedSorts(selectedSort.filter((selected)=>selected!==sort))
        }
    }
    const removeItem = (itemToRemove) => {
        setSelectedSorts(selectedSort.filter(sort => sort !== itemToRemove));
      };
    // console.log(isHovered)
    // console.log(selectedSort)

    function formatCategoryName(category) {
        return category
            .split('-') // Split on hyphens
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join words with a space
    }
    console.log(audience)
    return (
    <div className='mx-[2vw] '>
        <div className='relative rounded-[1.875vw] w-full border-black border-[1px] h-[25.25vw]'>
        <img alt='hi' className='relative rounded-[1.875vw] hide-scrollbar w-full h-[25.25vw]'></img>
        <IconButton className='absolute right-[4vw] top-[3vw]'  btnSize={3.0625} padding={.85} iconWidth={2.1875}/>
        </div>  
        <h3 className='text-h3Text font-dyeLine font-bold leading-[120%] text-center py-[4vw]'>{formatCategoryName(category)} for {audience}</h3>
        <div className='flex flex-row'>
            <div className='w-[24.1875vw] pr-[1vw] flex flex-col gap-[1.5vw]'>
                <div className='flex flex-row'>
                    <h6 className='font-roboto font-bold text-h5Text'>
                       Filters
                    </h6>
                    <button className='leading-[150%] font-roboto text-regularText ml-auto'>
                        Clear All
                    </button>
                </div>
                <Filters category={category} audienceShop={audience}/>
            </div>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-[1vw] '>
            <div className='col col-span-3 flex flex-row'>
                
            <div className='flex flex-row gap-[1vw]'>
      {selectedSort.map((sort, index) => (
        <div key={sort} className="bg-[rgba(17,17,17,1)] gap-[.25vw] text-smallText items-center flex flex-row appearance-none rounded-[1.25vw] focus:outline-none p-[.5vw] border-black border-[1px] cursor-pointer "
          onMouseEnter={() => setHoveredSort(sort)} onMouseLeave={() => setHoveredSort(null)} > 
          <div className='flex flex-row justify-center items-center font-light  text-white transition-transform ease-in-out gap-[.5vw] '>
            <p>{sort}</p>
            
          </div>
          <div key={sort} className="  transform transition-transform duration-300" style={{ transform: hoveredSort === sort ? 'rotate(180deg)' : 'rotate(0deg)'}} onClick={(e) => {
      removeItem(sort);
    }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw"  color='white'
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
        </div>
      ))}
    </div>

                {/* Custom dropdown menu */}
                <div className='relative text-smallText w-[164px] group ml-auto ' onClick={()=>setIsHovered(!isHovered)}  >
                    
                    <div className="w-full text-smallText appearance-none rounded-[2vw] focus:outline-none p-[.5vw] border-black border-[1px] cursor-pointer">
                        <div className='flex  flex-row justify-center items-center transition-transform ease-in-out gap-[.5vw] '>
                        <p >{ 'Sort'}</p>
                        <div className="pointer-events-none  transform transition-transform duration-300 rotate-180     " style={{ transform:isHovered? 'rotate(180deg)':'rotate(0deg)' }}  >
                    <svg width=".8125vw" height=".5vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" fill="black"/>
                            </svg>
                    </div>
                        </div>
                        
                        </div>

                        
                        {isHovered && (
                            <div
                            className="absolute w-full bg-white border border-black rounded-[.75vw] hide-scrollbar  z-10"
                            style={{ maxHeight: '200px', overflowY: 'auto' }}
                            >
                            {sortOptions.map((sort, index) => (
                                <div
                                key={index}
                                className="p-[.75vw] hover:bg-gray-200 cursor-pointer"
                                onClick={() => {    
                                    addSort(sort);
                                    setIsHovered(false);
                                }}
                                >
                                {sort}
                                </div>
                            ))}
                            </div>
                        )}

                    
                    </div>
            </div>
        {
            product.map((item,index)=>{
                return(
                    <div key={index}  className='w-[22.875vw] '>
                    <Item image={item.image[0]} comapny={item.comapny} rating={item.rating} title={item.title} price={item.price} colour={item.colour} />
                    </div>
                )
            })
        }
         </div>
         </div>
        
    </div>    
    );
};
