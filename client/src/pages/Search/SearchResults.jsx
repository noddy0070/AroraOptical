import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { TransitionLink } from '../../Routes/TransitionLink';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import Filters from '../../components/Filters.jsx';
import Item from '../Shop/item';

const sortOptions = [
    'Price: Low to High',
    'Price: High to Low',
    'Newest Arrivals',
    'Best Sellers'
];

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSort, setSelectedSorts] = useState([]);
    const [hoveredSort, setHoveredSort] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [activeFilters, setActiveFilters] = useState({Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]});
    const [clearTrigger, setClearTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    const performSearch = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/product/search', {
                params: { q: query, limit: 50 },
            });

            if (response.data.success) {
                setProducts(response.data.products);
                setFilteredProducts(response.data.products);
            } else {
                setError('No products found');
            }
        } catch (err) {
            console.error('Search error:', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

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

    const handleFiltersChange = (filters) => {
        setActiveFilters(filters);
    };

    const handleClearAllFilters = () => {
        setActiveFilters({Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]});
        setClearTrigger(prev => prev + 1);
    };

    // Filter products based on active filters (mirrors Shop.jsx)
    const filterProducts = (products, filters) => {
        let filtered = [...products];

        // Filter by audience
        if (filters.Audience && filters.Audience.length > 0) {
            filtered = filtered.filter(product => {
                if (product.gender) {
                    const productGender = product.gender.toLowerCase();
                    const isUnisex = productGender === 'unisex';

                    if (isUnisex) {
                        return filters.Audience.some(audience =>
                            audience.toLowerCase() === 'unisex' ||
                            audience.toLowerCase() === 'men' ||
                            audience.toLowerCase() === 'women'
                        );
                    }

                    return filters.Audience.some(audience =>
                        audience.toLowerCase() === productGender
                    );
                }

                const hasAudienceMatch = product.frameAttributes?.some(attr =>
                    (attr.name.toLowerCase().includes('gender') ||
                     attr.name.toLowerCase().includes('audience') ||
                     attr.name.toLowerCase().includes('classification')) &&
                    filters.Audience.some(audience => {
                        const attrValue = attr.value.toLowerCase();
                        const audienceLower = audience.toLowerCase();

                        if (attrValue.includes('unisex')) {
                            return audienceLower === 'unisex' ||
                                   audienceLower === 'men' ||
                                   audienceLower === 'women';
                        }

                        return attrValue.includes(audienceLower);
                    })
                );

                if (hasAudienceMatch) return true;

                const textFields = [
                    product.modelTitle,
                    product.modelName,
                    product.description,
                    product.brand
                ].join(' ').toLowerCase();

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
        }

        // Filter by brand
        if (filters.Brands && filters.Brands.length > 0) {
            filtered = filtered.filter(product =>
                filters.Brands.includes(product.brand)
            );
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
        }

        // Filter by size
        if (filters.Sizes && filters.Sizes.length > 0) {
            filtered = filtered.filter(product => {
                if (product.size && Array.isArray(product.size)) {
                    return product.size.some(size => filters.Sizes.includes(size));
                }

                const hasSizeMatch = product.frameAttributes?.some(attr =>
                    attr.name.toLowerCase().includes('size') &&
                    filters.Sizes.some(size =>
                        attr.value.toLowerCase().includes(size.toLowerCase())
                    )
                );

                if (hasSizeMatch) return true;

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
        }

        return filtered;
    };

    // Update filtered products when filters change
    useEffect(() => {
        const filtered = filterProducts(products, activeFilters);
        setFilteredProducts(filtered);
    }, [products, activeFilters]);

    // Reset to page 1 whenever filters, sort, per-page, or query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilters, selectedSort, itemsPerPage, searchQuery]);

    // Sort products based on selected sort options
    const getSortedProducts = () => {
        let sortedProducts = [...filteredProducts];

        selectedSort.forEach(sort => {
            switch(sort) {
                case 'Price: Low to High':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'Price: High to Low':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'Newest Arrivals':
                    sortedProducts.sort((a, b) => b._id.localeCompare(a._id));
                    break;
                case 'Best Sellers':
                    sortedProducts.sort((a, b) => (b.orders || 0) - (a.orders || 0));
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

    return (
        <div className=''>
            <div className='flex justify-center pt-[6vw] md:pt-[3vw] px-[5vw] md:px-0'>
                <form onSubmit={handleSearch} className='relative w-full md:w-[36vw]'>
                    <div className='flex items-center bg-gray-100 rounded-[3vw] md:rounded-[2vw] px-[4vw] md:px-[1.25vw] py-[2.5vw] md:py-[.75vw] border border-transparent focus-within:border-black transition-colors'>
                        <img src={SearchIcon} alt="Search" className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw] mr-[3vw] md:mr-[.75vw]' />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products..."
                            className='flex-1 bg-transparent outline-none text-gray-800 font-roboto text-regularTextPhone md:text-regularText'
                        />
                    </div>
                </form>
            </div>

            <h3 className='text-h3TextPhone md:text-h3Text font-dyeLine font-bold leading-[120%] text-center py-[6vw] md:py-[4vw] px-[5vw] md:px-0'>
                Search results for &quot;{searchQuery}&quot;
            </h3>

            {error ? (
                <div className='flex flex-col items-center justify-center gap-[3vw] md:gap-[1vw] py-[15vw] md:py-[6vw]'>
                    <p className='text-gray-500 text-h5TextPhone md:text-h5Text font-roboto'>No products found</p>
                    <p className='text-gray-400 text-regularTextPhone md:text-regularText font-roboto'>Try adjusting your search terms</p>
                    <TransitionLink to="/" className='font-roboto bg-black text-white px-[6vw] md:px-[2vw] py-[2.5vw] md:py-[.75vw] rounded-[5vw] md:rounded-[2vw] hover:bg-gray-800 transition-colors text-regularTextPhone md:text-regularText'>
                        Back to Home
                    </TransitionLink>
                </div>
            ) : (
                <div className='flex flex-col md:flex-row mx-[5vw] md:mx-[2vw] gap-[6vw] md:gap-0'>
                    <div className='w-full md:w-[24.1875vw] pr-0 md:pr-[1vw] md:sticky md:top-[5.5vw] md:self-start md:max-h-[calc(100vh-7vw)] md:overflow-y-auto hide-scrollbar'>
                        <div className='flex flex-col gap-[4vw] md:gap-[1.25vw] bg-white border border-gray-200 rounded-[3vw] md:rounded-[.75vw] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.05)] px-[4vw] md:px-[1.5vw] py-[4vw] md:py-[1.5vw]'>
                            <div className='flex flex-row items-center'>
                                <h6 className='font-roboto font-bold text-h5TextPhone md:text-h5Text'>Filters</h6>
                                <button
                                    onClick={handleClearAllFilters}
                                    className='leading-[150%] font-roboto text-regularTextPhone md:text-regularText ml-auto text-gray-500 hover:text-black transition-colors'
                                >
                                    Clear All
                                </button>
                            </div>
                            <Filters
                                productCategory='Sunglasses'
                                onFiltersChange={handleFiltersChange}
                                onClearAll={handleClearAllFilters}
                                clearTrigger={clearTrigger}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col flex-1'>
                        {/* Sort section */}
                        <div className='flex flex-row items-center gap-[2vw] md:gap-[1vw] mb-[3vw] md:mb-[1vw]'>
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

                            <div className='flex flex-row flex-wrap gap-[2vw] md:gap-[1vw]'>
                                {selectedSort.map((sort) => (
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

                        {/* Count + per-page selector */}
                        {(() => {
                            const sortedProducts = getSortedProducts();
                            const totalProducts = sortedProducts.length;
                            const totalPages = Math.ceil(totalProducts / itemsPerPage);
                            const startIndex = (currentPage - 1) * itemsPerPage;
                            const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

                            const getPageNumbers = () => {
                                const pages = [];
                                if (totalPages <= 7) {
                                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                                } else {
                                    pages.push(1);
                                    if (currentPage > 3) pages.push('...');
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(totalPages - 1, currentPage + 1);
                                    for (let i = start; i <= end; i++) pages.push(i);
                                    if (currentPage < totalPages - 2) pages.push('...');
                                    pages.push(totalPages);
                                }
                                return pages;
                            };

                            return (
                                <>
                                    <div className='flex items-center justify-between mb-[3vw] md:mb-[1vw] text-smallTextPhone md:text-smallText text-gray-500'>
                                        <span>
                                            {totalProducts === 0
                                                ? 'No products'
                                                : `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, totalProducts)} of ${totalProducts}`}
                                        </span>
                                        <div className='flex items-center gap-[2vw] md:gap-[.5vw]'>
                                            <span className='text-gray-400'>Show:</span>
                                            {[20, 50, 100].map(n => (
                                                <button
                                                    key={n}
                                                    onClick={() => setItemsPerPage(n)}
                                                    className={`px-[3vw] md:px-[.6vw] py-[1vw] md:py-[.25vw] rounded-[3vw] md:rounded-[.5vw] border transition-colors ${
                                                        itemsPerPage === n
                                                            ? 'bg-black text-white border-black'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                                    }`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[3vw] md:gap-6'>
                                        {paginatedProducts.length > 0 ? (
                                            paginatedProducts.map((item, index) => (
                                                <div key={item._id || index}>
                                                    <Item product={item} />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 md:col-span-3 flex justify-center items-center h-[50vw] md:h-[20vw]">
                                                <div className="text-center">
                                                    <h4 className="text-h4TextPhone md:text-h4Text font-dyeLine font-bold mb-[2vw] md:mb-[1vw]">No Products Found</h4>
                                                    <p className="text-regularTextPhone md:text-regularText font-roboto text-gray-600">
                                                        We couldn&apos;t find any products matching your criteria.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className='flex items-center justify-center gap-[2vw] md:gap-[.5vw] mt-[6vw] md:mt-[2vw] flex-wrap'>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className='px-[3vw] md:px-[.75vw] py-[1.5vw] md:py-[.4vw] rounded-[3vw] md:rounded-[.5vw] border border-gray-300 text-smallTextPhone md:text-smallText disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors'
                                            >
                                                ‹ Prev
                                            </button>

                                            {getPageNumbers().map((page, i) =>
                                                page === '...'
                                                    ? <span key={`ellipsis-${i}`} className='px-[2vw] md:px-[.5vw] text-gray-400 text-smallTextPhone md:text-smallText'>…</span>
                                                    : (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`min-w-[8vw] md:min-w-[2vw] px-[2.5vw] md:px-[.6vw] py-[1.5vw] md:py-[.4vw] rounded-[3vw] md:rounded-[.5vw] border text-smallTextPhone md:text-smallText transition-colors ${
                                                                currentPage === page
                                                                    ? 'bg-black text-white border-black'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                            )}

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className='px-[3vw] md:px-[.75vw] py-[1.5vw] md:py-[.4vw] rounded-[3vw] md:rounded-[.5vw] border border-gray-300 text-smallTextPhone md:text-smallText disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors'
                                            >
                                                Next ›
                                            </button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
