import {useState, useEffect} from 'react';
import {Size as size, Colors as color, Material as frameMaterial, Type as frameType, Shape as shapes, GlassesBrand, LensBrand, AccessoriesBrand, AccessoriesType, Wearability, LensType, CategoryOfLens} from '../data/glassesInformationData'

/**
 * Filters component that renders different filter options based on product category
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {Function} props.onClearAll - Callback when clear all is clicked
 * @param {boolean} props.clearTrigger - Trigger to clear all filters
 * @param {string} props.productCategory - Product category ('Sunglasses', 'Eyeglasses', 'Accessories', 'Contact Lenses')
 * 
 * Filter categories:
 * - Sunglasses/Eyeglasses: Audience, Brands, Shapes, Frame Type, Frame Material, Colors, Sizes
 * - Accessories: Brands, Accessories Type
 * - Contact Lenses: Brands, Wearability, Lens Type, Category Of Lens
 */
 export default  function Filters({ onFiltersChange, onClearAll, clearTrigger, productCategory = 'Sunglasses'}) {
     // Function to get initial filter structure based on category
     const getInitialFilterState = (category) => {
         switch(category) {
             case 'Sunglasses':
             case 'Eyeglasses':
                 return {Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]};
             case 'Accessories':
                 return {Brands:[],"Accessories Type":[]};
             case 'Contact Lenses':
                 return {Brands:[],Wearability:[],"Lens Type":[],"Category Of Lens":[]};
             default:
                 return {Audience:[],Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]};
         }
     };

     const [filtersSelected, setFiltersSelected] = useState(getInitialFilterState(productCategory));
     const [showFilterOptions, setShowFilterOptions] = useState([]); // Start with all sections closed
    
    const clearAllFilters = () => {
        setFiltersSelected(getInitialFilterState(productCategory));
        setShowFilterOptions([]); // Close all filter sections
        // Also call parent's clear function if provided
        if (onClearAll) {
            onClearAll();
        }
    };
    
    // Notify parent component when filters change
    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange(filtersSelected);
        }
    }, [filtersSelected, onFiltersChange]);

    // Listen for clear trigger from parent
    useEffect(() => {
        if (clearTrigger) {
            setFiltersSelected(getInitialFilterState(productCategory));
            setShowFilterOptions([]);
        }
    }, [clearTrigger, productCategory]);

    // Update filter state when product category changes
    useEffect(() => {
        setFiltersSelected(getInitialFilterState(productCategory));
        setShowFilterOptions([]);
    }, [productCategory]);
    
    // Debug: Log filter changes
    
  const renderFilterOptions = (options, id) => {
    const isOpen = showFilterOptions.includes(id);
    
    return (
      <div id={id} className="font-roboto flex flex-col  border-black border-b-[1px] transition-all duration-200 ease-in-out">
        <div className='flex flex-row items-center  transition-colors duration-200 cursor-pointer' onClick={() => {
              setShowFilterOptions((prev) => 
                prev.includes(id) 
                  ? [] // Close all if clicking on open section
                  : [id] // Open only this section
              );
            }}>
          <p className='mr-auto font-semibold text-smallTextPhone md:text-mediumText py-[1.25vw]'>{id}</p>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 12 7" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M6.32702 6.47135C6.1464 6.65197 5.85361 6.65197 5.67299 6.47135L0.957725 1.75608C0.777112 1.57546 0.777112 1.28267 0.957725 1.10205L1.17575 0.884C1.35636 0.70338 1.6492 0.70338 1.82982 0.884L6 5.05421L10.1702 0.884C10.3508 0.70338 10.6436 0.70338 10.8242 0.884L11.0423 1.10205C11.2229 1.28267 11.2229 1.57546 11.0423 1.75608L6.32702 6.47135Z" fill="black"/>
          </svg>
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-row flex-wrap gap-[8px] py-2 mb-[1vw]">
            {options.map((option, index) => (
              id === 'Colors' ? (
                <div 
                  key={index} 
                  onClick={() => {
                    setFiltersSelected((prev) => ({
                      ...prev,
                      [id]: prev[id].includes(option.colorName) 
                        ? prev[id].filter((item) => item !== option.colorName)
                        : [...prev[id], option.colorName]
                    }));
                  }} 
                  className={`pl-[2vw] flex flex-row gap-[.75vw] items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-md py-1 ${options.length-1 === index ? 'mb-[1.5vw]' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={filtersSelected[id].includes(option.colorName)} 
                    onChange={() => {}}
                    className="w-[1.125vw] h-[1.125vw]"
                  />
                  <p className="text-regularText">{option.colorName}</p>
                </div>
              ) : (
                <div 
                  key={index} 
                  onClick={() => {
                    setFiltersSelected((prev) => ({
                      ...prev,
                      [id]: prev[id].includes(option) 
                        ? prev[id].filter((item) => item !== option)
                        : [...prev[id], option]
                    }));
                  }} 
                  className={` flex flex-row gap-[.75vw] items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-md px-2 py-1 `}
                >
                  <input
                    type="checkbox"
                    checked={filtersSelected[id].includes(option)} 
                    onChange={() => {}}
                    className="w-[1.125vw] h-[1.125vw]"
                  />
                  <p className="text-regularText">{option}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  };
    // Function to render filters based on category
    const renderFiltersByCategory = () => {
        switch(productCategory) {
            case 'Sunglasses':
            case 'Eyeglasses':
                return (
                    <>
                        {renderFilterOptions(['Unisex', 'Men', 'Women', 'Kids'], 'Audience')}
                        {renderFilterOptions(GlassesBrand, 'Brands')}
                        {renderFilterOptions(shapes, 'Shapes')}
                        {renderFilterOptions(frameType, 'Frame Type')}
                        {renderFilterOptions(frameMaterial, 'Frame Material')}
                        {renderFilterOptions(color, 'Colors')}
                        {renderFilterOptions(size, 'Sizes')}
                    </>
                );
            case 'Accessories':
                return (
                    <>
                        {renderFilterOptions(AccessoriesBrand, 'Brands')}
                        {renderFilterOptions(AccessoriesType, 'Accessories Type')}
                    </>
                );
            case 'Contact Lenses':
                return (
                    <>
                        {renderFilterOptions(LensBrand, 'Brands')}
                        {renderFilterOptions(Wearability, 'Wearability')}
                        {renderFilterOptions(LensType, 'Lens Type')}
                        {renderFilterOptions(CategoryOfLens, 'Category Of Lens')}
                    </>
                );
            default:
                return (
                    <>
                        {renderFilterOptions(['Unisex', 'Men', 'Women', 'Kids'], 'Audience')}
                        {renderFilterOptions(GlassesBrand, 'Brands')}
                        {renderFilterOptions(shapes, 'Shapes')}
                        {renderFilterOptions(frameType, 'Frame Type')}
                        {renderFilterOptions(frameMaterial, 'Frame Material')}
                        {renderFilterOptions(color, 'Colors')}
                        {renderFilterOptions(size, 'Sizes')}
                    </>
                );
        }
    };

    return (
        <div>
            {renderFiltersByCategory()}
        </div>
    )
}