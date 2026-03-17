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
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]});
    const [clearTrigger, setClearTrigger] = useState(0);

    console.log('products',products);

    useEffect(() => {
        
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Convert audience to gender parameter
                const genderParam = audience.toLowerCase() === "everyone" || audience.toLowerCase() === "glasses" ? "" : audience.toLowerCase();
                console.log('genderParam',genderParam);
                
                // Check if this is a new arrivals or bestsellers request
                const isNewArrivals = audience.toLowerCase() === "new-arrivals";
                const isBestsellers = audience.toLowerCase() === "bestsellers";
                const isAccessories = audience.toLowerCase() === "accessories";
                
                // Public shop listing should use public product API (admin routes require auth)
                const response = await axios.get(`${baseURL}/api/product/get`, {
                    params: {
                        category: category,
                        gender: isNewArrivals || isBestsellers ? "" : genderParam,
                        newArrivals: isNewArrivals ? "true" : "false",
                        bestsellers: isBestsellers ? "true" : "false",
                        accessories: isAccessories ? "true" : "false"
                    }
                });

                if (response.data.success) {
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products); // Initialize filtered products
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

    // Handle filter changes from Filters component
    const handleFiltersChange = (filters) => {
        setActiveFilters(filters);
        console.log('Filters changed:', filters);
    };

    // Handle clear all filters
    const handleClearAllFilters = () => {
        setActiveFilters({Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]});
        setClearTrigger(prev => prev + 1); // Trigger clear in Filters component
        console.log('All filters cleared from Shop component');
    };

    // Filter products based on active filters
    const filterProducts = (products, filters) => {
        let filtered = [...products];
        
        console.log('Filtering products with:', filters);
        
        // Filter by audience
        if (filters.Audience && filters.Audience.length > 0) {
            filtered = filtered.filter(product => {
                // Check if product has gender field
                if (product.gender) {
                    const productGender = product.gender.toLowerCase();
                    const isUnisex = productGender === 'unisex';
                    
                    // If product is unisex, show it for Men, Women, and Unisex filters
                    if (isUnisex) {
                        return filters.Audience.some(audience => 
                            audience.toLowerCase() === 'unisex' ||
                            audience.toLowerCase() === 'men' ||
                            audience.toLowerCase() === 'women'
                        );
                    }
                    
                    // For non-unisex products, match exact gender
                    return filters.Audience.some(audience => 
                        audience.toLowerCase() === productGender
                    );
                }
                
                // Check in frameAttributes for gender/audience
                const hasAudienceMatch = product.frameAttributes?.some(attr => 
                    (attr.name.toLowerCase().includes('gender') || 
                     attr.name.toLowerCase().includes('audience') ||
                     attr.name.toLowerCase().includes('classification')) && 
                    filters.Audience.some(audience => {
                        const attrValue = attr.value.toLowerCase();
                        const audienceLower = audience.toLowerCase();
                        
                        // If attribute says unisex, show for Men, Women, and Unisex
                        if (attrValue.includes('unisex')) {
                            return audienceLower === 'unisex' ||
                                   audienceLower === 'men' ||
                                   audienceLower === 'women';
                        }
                        
                        // Otherwise match exactly
                        return attrValue.includes(audienceLower);
                    })
                );
                
                if (hasAudienceMatch) return true;
                
                // Fallback: check in text fields
                const textFields = [
                    product.modelTitle,
                    product.modelName,
                    product.description,
                    product.brand
                ].join(' ').toLowerCase();
                
                // Check if text contains unisex - if so, show for Men, Women, and Unisex
                if (textFields.includes('unisex')) {
                    return filters.Audience.some(audience => 
                        audience.toLowerCase() === 'unisex' ||
                        audience.toLowerCase() === 'men' ||
                        audience.toLowerCase() === 'women'
                    );
                }
                
                return filters.Audience.some(audience => 
                    textFields.includes(audience.toLowerCase())
                );
            });
            console.log('After audience filter:', filtered.length);
        }
        
        // Filter by brand
        if (filters.Brands && filters.Brands.length > 0) {
            filtered = filtered.filter(product => 
                filters.Brands.includes(product.brand)
            );
            console.log('After brand filter:', filtered.length);
        }
        
        // Filter by shape
        if (filters.Shapes && filters.Shapes.length > 0) {
            filtered = filtered.filter(product => 
                product.frameAttributes?.some(attr => 
                    (attr.name.toLowerCase().includes('shape') || 
                     attr.name.toLowerCase().includes('frame')) && 
                    filters.Shapes.some(shape => 
                        attr.value.toLowerCase().includes(shape.toLowerCase())
                    )
                ) || 
                // Fallback: check in text fields
                filters.Shapes.some(shape => {
                    const textFields = [
                        product.modelTitle,
                        product.modelName,
                        product.description,
                        product.brand
                    ].join(' ').toLowerCase();
                    return textFields.includes(shape.toLowerCase());
                })
            );
            console.log('After shape filter:', filtered.length);
        }
        
        // Filter by frame type
        if (filters["Frame Type"] && filters["Frame Type"].length > 0) {
            filtered = filtered.filter(product => 
                product.frameAttributes?.some(attr => 
                    (attr.name.toLowerCase().includes('type') || 
                     attr.name.toLowerCase().includes('frame')) && 
                    filters["Frame Type"].some(type => 
                        attr.value.toLowerCase().includes(type.toLowerCase())
                    )
                ) ||
                // Fallback: check in text fields
                filters["Frame Type"].some(type => {
                    const textFields = [
                        product.modelTitle,
                        product.modelName,
                        product.description,
                        product.brand
                    ].join(' ').toLowerCase();
                    return textFields.includes(type.toLowerCase());
                })
            );
            console.log('After frame type filter:', filtered.length);
        }
        
        // Filter by frame material
        if (filters["Frame Material"] && filters["Frame Material"].length > 0) {
            filtered = filtered.filter(product => 
                product.frameAttributes?.some(attr => 
                    (attr.name.toLowerCase().includes('material') || 
                     attr.name.toLowerCase().includes('frame')) && 
                    filters["Frame Material"].some(material => 
                        attr.value.toLowerCase().includes(material.toLowerCase())
                    )
                ) ||
                // Fallback: check in text fields
                filters["Frame Material"].some(material => {
                    const textFields = [
                        product.modelTitle,
                        product.modelName,
                        product.description,
                        product.brand
                    ].join(' ').toLowerCase();
                    return textFields.includes(material.toLowerCase());
                })
            );
            console.log('After frame material filter:', filtered.length);
        }
        
        // Filter by colors
        if (filters.Colors && filters.Colors.length > 0) {
            filtered = filtered.filter(product => 
                product.frameAttributes?.some(attr => 
                    (attr.name.toLowerCase().includes('color') || 
                     attr.name.toLowerCase().includes('colour')) && 
                    filters.Colors.some(color => 
                        attr.value.toLowerCase().includes(color.toLowerCase())
                    )
                ) ||
                // Fallback: check in text fields
                filters.Colors.some(color => {
                    const textFields = [
                        product.modelTitle,
                        product.modelName,
                        product.description,
                        product.brand
                    ].join(' ').toLowerCase();
                    return textFields.includes(color.toLowerCase());
                })
            );
            console.log('After color filter:', filtered.length);
        }
        
        // Filter by size
        if (filters.Sizes && filters.Sizes.length > 0) {
            filtered = filtered.filter(product => {
                // Check if product has size field
                if (product.size && Array.isArray(product.size)) {
                    return product.size.some(size => filters.Sizes.includes(size));
                }
                
                // Check in frameAttributes for size
                const hasSizeMatch = product.frameAttributes?.some(attr => 
                    attr.name.toLowerCase().includes('size') && 
                    filters.Sizes.some(size => 
                        attr.value.toLowerCase().includes(size.toLowerCase())
                    )
                );
                
                if (hasSizeMatch) return true;
                
                // Fallback: check in text fields
                const textFields = [
                    product.modelTitle,
                    product.modelName,
                    product.description,
                    product.brand
                ].join(' ').toLowerCase();
                
                return filters.Sizes.some(size => 
                    textFields.includes(size.toLowerCase())
                );
            });
            console.log('After size filter:', filtered.length);
        }
        
        console.log('Final filtered products:', filtered.length);
        return filtered;
    };

    // Update filtered products when filters change
    useEffect(() => {
        const filtered = filterProducts(products, activeFilters);
        setFilteredProducts(filtered);
    }, [products, activeFilters]);

    function formatCategoryName(category) {
        return category
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    
    // Sort products based on selected sort options
    const getSortedProducts = () => {
        let sortedProducts = [...filteredProducts]; // Use filtered products instead of all products
        
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
            <div className='relative w-full h-[100vw] md:h-[25.25vw]'>
                <img 
                    alt='Shop Banner'
                    loading="eager"
                    fetchpriority="high"
                    sizes="100vw"
                    className='relative hide-scrollbar w-full h-[100vw] md:h-[25.25vw] object-cover clickable'
                    src={shopBanner1}
                />
                <IconButton className='absolute right-[4vw] md:right-[4vw] top-[3vw] md:top-[3vw]' btnSizePhone={12} paddingPhone={1} iconWidthPhone={20} btnSize={3.0625} padding={.85} iconWidth={2.1875}/>
            </div>
            <h3 className='text-h3TextPhone md:text-h3Text font-dyeLine font-bold leading-[120%] text-center py-[6vw] md:py-[4vw] px-[5vw] md:px-0'>
                {audience==='Everyone' || audience==='Men' || audience==='Women' || audience==='Kids' ? 
                    `${formatCategoryName(category)} for ${audience}` : 
                    `${audience.charAt(0).toUpperCase() + audience.slice(1)} ${formatCategoryName(category)}`
                }
            </h3>
            <div className='flex flex-col md:flex-row mx-[5vw] md:mx-[2vw] gap-[6vw] md:gap-0'>
                <div className='w-full md:w-[24.1875vw] pr-0 md:pr-[1vw] flex flex-col gap-[4vw] md:gap-[1.5vw]'>
                    <div className='flex flex-row'>
                        <h6 className='font-roboto font-bold text-h5TextPhone md:text-h5Text'>Filters</h6>
                        <button 
                            onClick={handleClearAllFilters}
                            className='leading-[150%] font-roboto text-regularTextPhone md:text-regularText ml-auto hover:text-blue-600 transition-colors'
                        >
                            Clear All
                        </button>
                    </div>
                    <Filters 
                        productCategory={category} 
                        audienceShop={audience}
                        onFiltersChange={handleFiltersChange}
                        onClearAll={handleClearAllFilters}
                        clearTrigger={clearTrigger}
                    />
                </div>

                <div className='flex flex-col flex-1'>
                    {/* Sort section */}
                    <div className='flex flex-row items-center gap-[2vw] md:gap-[1vw] mb-[3vw] md:mb-[1vw]'>
                        {/* Sort dropdown */}
                        <div className='relative text-smallTextPhone md:text-smallText w-[41vw] md:w-[164px]' onClick={() => setIsHovered(!isHovered)}>
                            <div className="w-full text-smallTextPhone md:text-smallText appearance-none rounded-[5vw] md:rounded-[2vw] focus:outline-none p-[1.25vw] md:p-[.5vw] border-black border-[1px] cursor-pointer">
                                <div className='flex flex-row justify-center items-center transition-transform ease-in-out gap-[1.25vw] md:gap-[.5vw]'>
                                    <p>Sort</p>
                                    <div className="pointer-events-none transform transition-transform duration-300 rotate-180" 
                                        style={{ transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <svg width="3.25vw" height="2vw" className="md:w-[.8125vw] md:h-[.5vw]" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" 
                                                d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" 
                                                fill="black"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {isHovered && (
                                <div className="absolute w-full bg-white border border-black rounded-[3vw] md:rounded-[.75vw] hide-scrollbar z-10"
                                    style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {sortOptions.map((sort, index) => (
                                        <div key={index}
                                            className="p-[3vw] md:p-[.75vw] hover:bg-gray-200 cursor-pointer text-smallTextPhone md:text-smallText"
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
                        <div className='flex flex-row flex-wrap gap-[2vw] md:gap-[1vw]'>
                            {selectedSort.map((sort, index) => (
                                <div key={sort} 
                                    className="bg-[rgba(17,17,17,1)] gap-[1vw] md:gap-[.25vw] text-smallTextPhone md:text-smallText items-center flex flex-row appearance-none rounded-[5vw] md:rounded-[1.25vw] focus:outline-none p-[1.25vw] md:p-[.5vw] border-black border-[1px] cursor-pointer"
                                    onMouseEnter={() => setHoveredSort(sort)} 
                                    onMouseLeave={() => setHoveredSort(null)}
                                >
                                    <div className='flex flex-row justify-center items-center font-light text-white transition-transform ease-in-out gap-[1.25vw] md:gap-[.5vw]'>
                                        <p>{sort}</p>
                                    </div>
                                    <div 
                                        className="transform transition-transform duration-300" 
                                        style={{ transform: hoveredSort === sort ? 'rotate(180deg)' : 'rotate(0deg)'}}
                                        onClick={() => removeItem(sort)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="4vw" height="4vw" className="md:w-[1vw] md:h-[1vw]" color='white'
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
                    <div className='grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[3vw] md:gap-6'>
                        {getSortedProducts().length > 0 ? (
                            getSortedProducts().map((item, index) => (
                                <div key={index} >
                                    <Item 
                                        product={item}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 md:col-span-3 flex justify-center items-center h-[50vw] md:h-[20vw]">
                                <div className="text-center">
                                    <h4 className="text-h4TextPhone md:text-h4Text font-dyeLine font-bold mb-[2vw] md:mb-[1vw]">No Products Found</h4>
                                    <p className="text-regularTextPhone md:text-regularText font-roboto text-gray-600">
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
