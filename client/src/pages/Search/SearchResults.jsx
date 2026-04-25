import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '@/url';
import { TransitionLink } from '../../Routes/TransitionLink';
import SearchIcon from '../../assets/images/icons/SearchIcon.svg';
import productPlaceholder from '../../assets/images/productPlaceholder.png';
import { Material, Shape, Colors, Size, GlassesBrand, Classification } from '../../data/glassesInformationData';
import TickIcon from '../../assets/images/icons/tick_icon.png';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterAudience, setFilterAudience] = useState('All');
  const [filterMaterial, setFilterMaterial] = useState([]);
  const [filterShape, setFilterShape] = useState([]);
  const [filterSize, setFilterSize] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterColor, setFilterColor] = useState([]);
  const [showFilterOptions, setShowFilterOptions] = useState([]);

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
    
      
      const response = await axios.get(`${baseURL}/api/product/search`, {
        params: { q: query, limit: 50 },
        withCredentials: true
      });


      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('No products found');
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error response:', error.response?.data);
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

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'popular':
        return sorted.sort((a, b) => b.orders - a.orders);
      default:
        return sorted;
    }
  };

  const filterProducts = (products) => {
    let filtered = products;
    
    // Filter by audience - try multiple approaches
    if (filterAudience !== 'All') {
      filtered = filtered.filter(product => {
        // Check if product has gender field
        if (product.gender) {
          return product.gender === filterAudience || product.gender === 'Unisex';
        }
        
        // Check in frameAttributes for gender/audience
        const hasAudienceMatch = product.frameAttributes?.some(attr => 
          (attr.name.toLowerCase().includes('gender') || 
           attr.name.toLowerCase().includes('audience') ||
           attr.name.toLowerCase().includes('classification')) && 
          (attr.value.toLowerCase().includes(filterAudience.toLowerCase()) ||
           attr.value.toLowerCase().includes('unisex'))
        );
        
        if (hasAudienceMatch) return true;
        
        // Fallback: check in modelTitle, modelName, or description
        const textFields = [
          product.modelTitle,
          product.modelName,
          product.description,
          product.brand
        ].join(' ').toLowerCase();
        
        return textFields.includes(filterAudience.toLowerCase());
      });
    }
    
    // Filter by material
    if (filterMaterial.length > 0) {
      filtered = filtered.filter(product => {
        // Check in frameAttributes first
        const hasMaterialMatch = product.frameAttributes?.some(attr => 
          (attr.name.toLowerCase().includes('material') || 
           attr.name.toLowerCase().includes('frame')) && 
          filterMaterial.some(material => 
            attr.value.toLowerCase().includes(material.toLowerCase())
          )
        );
        
        if (hasMaterialMatch) return true;
        
        // Fallback: check in text fields
        const textFields = [
          product.modelTitle,
          product.modelName,
          product.description,
          product.brand
        ].join(' ').toLowerCase();
        
        return filterMaterial.some(material => 
          textFields.includes(material.toLowerCase())
        );
      });
    }
    
    // Filter by shape
    if (filterShape.length > 0) {
      filtered = filtered.filter(product => {
        // Check in frameAttributes first
        const hasShapeMatch = product.frameAttributes?.some(attr => 
          (attr.name.toLowerCase().includes('shape') || 
           attr.name.toLowerCase().includes('frame')) && 
          filterShape.some(shape => 
            attr.value.toLowerCase().includes(shape.toLowerCase())
          )
        );
        
        if (hasShapeMatch) return true;
        
        // Fallback: check in text fields
        const textFields = [
          product.modelTitle,
          product.modelName,
          product.description,
          product.brand
        ].join(' ').toLowerCase();
        
        return filterShape.some(shape => 
          textFields.includes(shape.toLowerCase())
        );
      });
    }
    
    // Filter by size
    if (filterSize.length > 0) {
      filtered = filtered.filter(product => {
        // Check if product has size field
        if (product.size && Array.isArray(product.size)) {
          return product.size.some(size => filterSize.includes(size));
        }
        
        // Check in frameAttributes for size
        const hasSizeMatch = product.frameAttributes?.some(attr => 
          attr.name.toLowerCase().includes('size') && 
          filterSize.some(size => 
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
        
        return filterSize.some(size => 
          textFields.includes(size.toLowerCase())
        );
      });
    }
    
    // Filter by brand
    if (filterBrand.length > 0) {
      filtered = filtered.filter(product => 
        filterBrand.includes(product.brand)
      );
    }
    
    // Filter by color
    if (filterColor.length > 0) {
      filtered = filtered.filter(product => {
        // Check in frameAttributes first
        const hasColorMatch = product.frameAttributes?.some(attr => 
          (attr.name.toLowerCase().includes('color') || 
           attr.name.toLowerCase().includes('colour')) && 
          filterColor.some(color => 
            attr.value.toLowerCase().includes(color.toLowerCase())
          )
        );
        
        if (hasColorMatch) return true;
        
        // Fallback: check in text fields
        const textFields = [
          product.modelTitle,
          product.modelName,
          product.description,
          product.brand
        ].join(' ').toLowerCase();
        
        return filterColor.some(color => 
          textFields.includes(color.toLowerCase())
        );
      });
    }
    
    return filtered;
  };

  const getUniqueBrands = () => {
    const brands = [...new Set(products.map(product => product.brand))];
    return brands.sort();
  };

  const toggleFilterOption = (filterType, option) => {
    switch (filterType) {
      case 'material':
        setFilterMaterial(prev => 
          prev.includes(option) 
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case 'shape':
        setFilterShape(prev => 
          prev.includes(option) 
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case 'size':
        setFilterSize(prev => 
          prev.includes(option) 
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case 'brand':
        setFilterBrand(prev => 
          prev.includes(option) 
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
      case 'color':
        setFilterColor(prev => 
          prev.includes(option) 
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setFilterAudience('All');
    setFilterMaterial([]);
    setFilterShape([]);
    setFilterSize([]);
    setFilterBrand([]);
    setFilterColor([]);
    setSortBy('relevance');
    setShowFilterOptions([]); // Close all filter sections
  };

  const renderFilterOptions = (options, id, filterType) => {
    const isOpen = showFilterOptions.includes(id);
    
    return (
      <div className="font-roboto flex flex-col mb-[4vw] md:mb-4">
        <div className='flex border-black border-t-[1px] flex-row items-center'>
          <p className='mr-auto font-semibold text-smallTextPhone md:text-sm py-[2vw] md:py-2'>{id}</p>
          <svg 
            className={`cursor-pointer w-[4vw] md:w-4 h-[4vw] md:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            onClick={() => {
              setShowFilterOptions((prev) => 
                prev.includes(id) 
                  ? prev.filter((item) => item !== id)
                  : [...prev, id]
              );
            }} 
            viewBox="0 0 12 7" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M6.32702 6.47135C6.1464 6.65197 5.85361 6.65197 5.67299 6.47135L0.957725 1.75608C0.777112 1.57546 0.777112 1.28267 0.957725 1.10205L1.17575 0.884C1.35636 0.70338 1.6492 0.70338 1.82982 0.884L6 5.05421L10.1702 0.884C10.3508 0.70338 10.6436 0.70338 10.8242 0.884L11.0423 1.10205C11.2229 1.28267 11.2229 1.57546 11.0423 1.75608L6.32702 6.47135Z" fill="black"/>
          </svg>
        </div>
        {isOpen && (
          <div className="transition-all duration-200 ease-in-out">
            {options.map((option, index) => (
              id === 'Colors' ? (
                <div 
                  key={index} 
                  onClick={() => toggleFilterOption(filterType, option.colorName)} 
                  className={`pl-[4vw] md:pl-4 flex flex-row gap-[3vw] md:gap-3 py-[2vw] md:py-2 items-center cursor-pointer hover:bg-gray-100 ${options.length-1===index?'mb-[3vw] md:mb-3 ':''}`}
                >
                  <input
                    type="checkbox"
                    checked={filterColor.includes(option.colorName)} 
                    onChange={() => {}}
                    className="w-[4vw] md:w-4 h-[4vw] md:h-4"
                  />
                  <p className="text-smallTextPhone md:text-sm">{option.colorName}</p>
                </div>
              ) : (
                <div 
                  key={index} 
                  onClick={() => toggleFilterOption(filterType, option)} 
                  className={`pl-[4vw] md:pl-4 flex flex-row gap-[3vw] md:gap-3 py-[2vw] md:py-2 items-center cursor-pointer hover:bg-gray-100 ${options.length-1===index?'mb-[3vw] md:mb-3 ':''}`}
                >
                  <input
                    type="checkbox"
                    checked={
                      filterType === 'material' ? filterMaterial.includes(option) :
                      filterType === 'shape' ? filterShape.includes(option) :
                      filterType === 'size' ? filterSize.includes(option) :
                      filterType === 'brand' ? filterBrand.includes(option) :
                      filterType === 'color' ? filterColor.includes(option) : false
                    } 
                    onChange={() => {}}
                    className="w-[4vw] md:w-4 h-[4vw] md:h-4"
                  />
                  <p className="text-smallTextPhone md:text-sm">{option}</p>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(products), sortBy);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-[12vw] md:w-12 h-[12vw] md:h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-[4vw] md:mb-4'></div>
          <p className='text-gray-600 text-regularTextPhone md:text-regularText'>Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-[5vw] md:px-4 py-[6vw] md:py-6'>
          <div className='flex flex-col md:flex-row gap-[4vw] md:gap-4 items-center'>
            <div className='flex-1 w-full'>
              <form onSubmit={handleSearch} className='relative'>
                <div className='flex items-center bg-gray-100 rounded-[2vw] md:rounded-lg px-[4vw] md:px-4 py-[3vw] md:py-3'>
                  <img src={SearchIcon} alt="Search" className='w-[5vw] md:w-5 h-[5vw] md:h-5 text-gray-400 mr-[3vw] md:mr-3' />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className='flex-1 bg-transparent outline-none text-gray-800 text-regularTextPhone md:text-regularText'
                  />
                </div>
              </form>
            </div>
            <div className='text-smallTextPhone md:text-sm text-gray-600 w-full md:w-auto text-left md:text-center'>
              {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-[5vw] md:px-4 py-[6vw] md:py-6'>
        <div className='flex flex-col lg:flex-row gap-[6vw] md:gap-6'>
           {/* Filters Sidebar */}
           <div className='lg:w-64 bg-white rounded-[4vw] md:rounded-lg shadow-sm p-[4vw] md:p-4 h-fit'>
             <h3 className='font-semibold text-gray-800 mb-[4vw] md:mb-4 text-h4TextPhone md:text-h4Text'>Filters</h3>
             
             {/* Sort By */}
             <div className='mb-[6vw] md:mb-6'>
               <label className='block text-smallTextPhone md:text-sm font-medium text-gray-700 mb-[2vw] md:mb-2'>Sort By</label>
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className='w-full p-[2vw] md:p-2 border border-gray-300 rounded-[2vw] md:rounded-md text-smallTextPhone md:text-sm'
               >
                 <option value="relevance">Relevance</option>
                 <option value="price-low">Price: Low to High</option>
                 <option value="price-high">Price: High to Low</option>
                 <option value="newest">Newest First</option>
                 <option value="popular">Most Popular</option>
               </select>
             </div>

             {/* Audience Filter */}
             <div className='mb-[4vw] md:mb-4'>
               <div className='font-roboto flex flex-col mb-[4vw] md:mb-4'>
                 <div className='flex border-black border-t-[1px] flex-row items-center'>
                   <p className='mr-auto font-semibold text-smallTextPhone md:text-sm py-[2vw] md:py-2'>Audience</p>
                   <svg 
                     className={`cursor-pointer w-[4vw] md:w-4 h-[4vw] md:h-4 transition-transform duration-200 ${showFilterOptions.includes('Audience') ? 'rotate-180' : ''}`} 
                     onClick={() => {
                       setShowFilterOptions((prev) => 
                         prev.includes('Audience') 
                           ? prev.filter((item) => item !== 'Audience')
                           : [...prev, 'Audience']
                       );
                     }} 
                     viewBox="0 0 12 7" 
                     fill="none" 
                     xmlns="http://www.w3.org/2000/svg"
                   >
                     <path fillRule="evenodd" clipRule="evenodd" d="M6.32702 6.47135C6.1464 6.65197 5.85361 6.65197 5.67299 6.47135L0.957725 1.75608C0.777112 1.57546 0.777112 1.28267 0.957725 1.10205L1.17575 0.884C1.35636 0.70338 1.6492 0.70338 1.82982 0.884L6 5.05421L10.1702 0.884C10.3508 0.70338 10.6436 0.70338 10.8242 0.884L11.0423 1.10205C11.2229 1.28267 11.2229 1.57546 11.0423 1.75608L6.32702 6.47135Z" fill="black"/>
                   </svg>
                 </div>
                 {showFilterOptions.includes('Audience') && (
                   <div className="transition-all duration-200 ease-in-out">
                     {Classification.map((audience) => (
                       <div
                         key={audience}
                         onClick={() => setFilterAudience(audience)}
                         className={`pl-[4vw] md:pl-4 flex flex-row gap-[3vw] md:gap-3 py-[2vw] md:py-2 items-center cursor-pointer hover:bg-gray-100 ${
                           audience === 'Unisex' ? 'mb-[3vw] md:mb-3' : ''
                         }`}
                       >
                         <input
                           type="radio"
                           name="audience"
                           checked={filterAudience === audience}
                           onChange={() => {}}
                           className="w-[4vw] md:w-4 h-[4vw] md:h-4"
                         />
                         <p className="text-smallTextPhone md:text-sm">{audience}</p>
                         {filterAudience === audience && (
                           <img src={TickIcon} className="w-[4vw] md:w-4 h-[4vw] md:h-4 ml-auto" alt="Selected" />
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>

             {/* Material Filter */}
             {renderFilterOptions(Material, 'Material', 'material')}

             {/* Shape Filter */}
             {renderFilterOptions(Shape, 'Shape', 'shape')}

             {/* Size Filter */}
             {renderFilterOptions(Size, 'Size', 'size')}

             {/* Brand Filter */}
             {renderFilterOptions(GlassesBrand, 'Brand', 'brand')}

             {/* Color Filter */}
             {renderFilterOptions(Colors, 'Colors', 'color')}

             {/* Clear Filters */}
             <button
               onClick={clearAllFilters}
               className='w-full py-[2vw] md:py-2 px-[4vw] md:px-4 bg-gray-100 text-gray-700 rounded-[2vw] md:rounded-md hover:bg-gray-200 transition-colors text-smallTextPhone md:text-sm'
             >
               Clear All Filters
             </button>
           </div>

          {/* Results */}
          <div className='flex-1'>
            {error ? (
              <div className='text-center py-[12vw] md:py-12'>
                <div className='text-gray-500 text-h5TextPhone md:text-lg mb-[4vw] md:mb-4'>No products found</div>
                <p className='text-gray-400 mb-[6vw] md:mb-6 text-regularTextPhone md:text-regularText'>Try adjusting your search terms</p>
                <TransitionLink to="/" className='bg-blue-600 text-white px-[6vw] md:px-6 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg hover:bg-blue-700 transition-colors text-regularTextPhone md:text-regularText'>
                  Back to Home
                </TransitionLink>
              </div>
             ) : filteredAndSortedProducts.length === 0 ? (
               <div className='text-center py-[12vw] md:py-12'>
                 <div className='text-gray-500 text-h5TextPhone md:text-lg mb-[4vw] md:mb-4'>No products match your filters</div>
                 <button
                   onClick={clearAllFilters}
                   className='bg-blue-600 text-white px-[6vw] md:px-6 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg hover:bg-blue-700 transition-colors text-regularTextPhone md:text-regularText'
                 >
                   Clear All Filters
                 </button>
               </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[3vw] md:gap-6'>
                {filteredAndSortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className='bg-white rounded-[2vw] md:rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group'
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className='aspect-square overflow-hidden rounded-t-[2vw] md:rounded-t-lg'>
                      <img
                        src={product.images[0] || productPlaceholder}
                        alt={product.modelTitle}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-[4vw] md:p-4'>
                      <h3 className='font-semibold text-gray-800 text-smallTextPhone md:text-sm mb-[1vw] md:mb-1 line-clamp-2'>
                        {product.modelTitle}
                      </h3>
                      <p className='text-gray-600 text-tinyTextPhone md:text-xs mb-[2vw] md:mb-2'>{product.brand}</p>
                      <div className='flex items-center justify-between'>
                        <span className='text-blue-600 font-bold text-smallTextPhone md:text-sm'>
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className='text-green-600 text-tinyTextPhone md:text-xs'>
                            {product.discount}% off
                          </span>
                        )}
                      </div>
                      {product.orders > 0 && (
                        <div className='text-tinyTextPhone md:text-xs text-gray-500 mt-[1vw] md:mt-1'>
                          {product.orders} sold
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
