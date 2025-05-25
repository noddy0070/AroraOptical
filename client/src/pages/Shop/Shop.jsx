import React, { useState, useEffect } from 'react';
import { IconButton } from '../../components/button';
import Item from './item';
import Filters from '../../components/Filters.jsx';
import axios from 'axios';
import { baseURL } from '@/url';
import { TransitionLink } from '@/Routes/TransitionLink';
import shopBanner1 from '../../assets/images/shopBanner1.png'
const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Newest Arrivals',
    'Best Sellers'
];

export default function Shop({category, audience}) {
    const [selectedSort, setSelectedSorts] = useState([]);
    const [hoveredSort, setHoveredSort] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('products',products);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Convert audience to gender parameter
                const genderParam = audience.toLowerCase() === "everyone" ? "" : audience.toLowerCase();
                
                // Check if this is a new arrivals or bestsellers request
                const isNewArrivals = audience.toLowerCase() === "new-arrivals";
                const isBestsellers = audience.toLowerCase() === "bestsellers";
                
                const response = await axios.get(`${baseURL}/api/admin/get-products`, {
                    params: {
                        category: category,
                        gender: isNewArrivals || isBestsellers ? "" : genderParam,
                        newArrivals: isNewArrivals ? "true" : "false",
                        bestsellers: isBestsellers ? "true" : "false"
                    }
                });

                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, audience]);

    const addSort = (sort) => {
        if (!selectedSort.includes(sort)) {
            setSelectedSorts([...selectedSort, sort]);
        } else {
            setSelectedSorts(selectedSort.filter((selected) => selected !== sort));
        }
    };

    const removeItem = (itemToRemove) => {
        setSelectedSorts(selectedSort.filter(sort => sort !== itemToRemove));
    };

    function formatCategoryName(category) {
        return category
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    
    // Sort products based on selected sort options
    const getSortedProducts = () => {
        let sortedProducts = [...products];
        
        selectedSort.forEach(sort => {
            switch(sort) {
                case 'Price: Low to High':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'Price: High to Low':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'Newest Arrivals':
                    // Assuming newer products have higher IDs or a timestamp field
                    sortedProducts.sort((a, b) => b._id.localeCompare(a._id));
                    break;
                case 'Best Sellers':
                    sortedProducts.sort((a, b) => b.orders - a.orders);
                    break;
                default:
                    break;
            }
        });
        
        return sortedProducts;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    return (
        <div className=''>
            <div className='relative  w-full h-[25.25vw]'>
                <img alt='hi' className='relative  hide-scrollbar w-full h-[25.25vw]' src={shopBanner1}></img>
                <IconButton className='absolute right-[4vw] top-[3vw]' btnSize={3.0625} padding={.85} iconWidth={2.1875}/>
            </div>
            <h3 className='text-h3Text font-dyeLine font-bold leading-[120%] text-center py-[4vw]'>
                {formatCategoryName(category)} for {audience}
            </h3>
            <div className='flex flex-row mx-[2vw]'>
                <div className='w-[24.1875vw] pr-[1vw] flex flex-col gap-[1.5vw]'>
                    <div className='flex flex-row'>
                        <h6 className='font-roboto font-bold text-h5Text'>Filters</h6>
                        <button className='leading-[150%] font-roboto text-regularText ml-auto'>Clear All</button>
                    </div>
                    <Filters category={category} audienceShop={audience}/>
                </div>

                <div className='flex flex-col flex-1'>
                    {/* Sort section */}
                    <div className='flex flex-row items-center gap-[1vw] mb-[1vw]'>
                        {/* Sort dropdown */}
                        <div className='relative text-smallText w-[164px]' onClick={() => setIsHovered(!isHovered)}>
                            <div className="w-full text-smallText appearance-none rounded-[2vw] focus:outline-none p-[.5vw] border-black border-[1px] cursor-pointer">
                                <div className='flex flex-row justify-center items-center transition-transform ease-in-out gap-[.5vw]'>
                                    <p>Sort</p>
                                    <div className="pointer-events-none transform transition-transform duration-300 rotate-180" 
                                        style={{ transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <svg width=".8125vw" height=".5vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" 
                                                d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" 
                                                fill="black"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {isHovered && (
                                <div className="absolute w-full bg-white border border-black rounded-[.75vw] hide-scrollbar z-10"
                                    style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {sortOptions.map((sort, index) => (
                                        <div key={index}
                                            className="p-[.75vw] hover:bg-gray-200 cursor-pointer"
                                            onClick={() => {
                                                addSort(sort);
                                                setIsHovered(false);
                                            }}>
                                            {sort}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected sort filters */}
                        <div className='flex flex-row flex-wrap gap-[1vw]'>
                            {selectedSort.map((sort, index) => (
                                <div key={sort} 
                                    className="bg-[rgba(17,17,17,1)] gap-[.25vw] text-smallText items-center flex flex-row appearance-none rounded-[1.25vw] focus:outline-none p-[.5vw] border-black border-[1px] cursor-pointer"
                                    onMouseEnter={() => setHoveredSort(sort)} 
                                    onMouseLeave={() => setHoveredSort(null)}
                                >
                                    <div className='flex flex-row justify-center items-center font-light text-white transition-transform ease-in-out gap-[.5vw]'>
                                        <p>{sort}</p>
                                    </div>
                                    <div 
                                        className="transform transition-transform duration-300" 
                                        style={{ transform: hoveredSort === sort ? 'rotate(180deg)' : 'rotate(0deg)'}}
                                        onClick={() => removeItem(sort)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw" color='white'
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-[1vw]'>
                        {getSortedProducts().length > 0 ? (
                            getSortedProducts().map((item, index) => (
                                <div key={index} className='w-[22.875vw]'>
                                    <TransitionLink to={`/product/${item._id}`}>
                                    <Item 
                                        image={item.images[0]} 
                                        comapny={item.brand}
                                        rating={item.rating || "0.0"}
                                        title={item.modelTitle}
                                        price={item.price}
                                        colour={item.frameAttributes.find(attr => attr.name === "Color")?.value || "N/A"}
                                        productId={item._id}
                                    />
                                    </TransitionLink>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center items-center h-[20vw]">
                                <div className="text-center">
                                    <h4 className="text-h4Text font-dyeLine font-bold mb-[1vw]">No Products Found</h4>
                                    <p className="text-regularText font-roboto text-gray-600">
                                        We couldn't find any products matching your criteria.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
