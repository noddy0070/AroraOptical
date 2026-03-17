import React,{useState,useRef,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import placeholder from "../../assets/images/CategoryPlaceholder.png";
import categoryPlaceholder from '../../assets/images/CategoryPlaceholder.png';
import WishListIcon from '../../assets/images/icons/WishlistIcon.svg'
import WishListIconFilled from '../../assets/images/icons/WishlistIconFilled.svg'
import './product.css';
import { IconButton } from '../../components/button';
import { renderStars } from '@/components/RenderStarts';
import axios from 'axios';
import { formatINR } from '@/components/IntToPrice';
import { baseURL } from '@/url';
import { TransitionLink } from '@/Routes/TransitionLink';
import { mapBrandToLogo, mapBrandToDescription } from '@/data/brandMap';


export default function ProductDescription({productToDisplay}){
    const [selectedSize, setSelectedSize] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isDetailClicked, setIsDetailClicked] = useState(true);
    const [isShipingClicked, setIsShipingClicked] = useState(true);
    const [isReturnClicked, setIsReturnClicked] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const tags = productToDisplay.hashtags.split(",").map(tag => tag.trim());
    const images = productToDisplay.images;

    // Drag scroll for tags
    const tagsRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleTagsMouseDown = (e) => {
        setIsMouseDown(true);
        setStartX(e.pageX - tagsRef.current.offsetLeft);
        setScrollLeft(tagsRef.current.scrollLeft);
    };

    const handleTagsMouseLeave = () => {
        setIsMouseDown(false);
    };

    const handleTagsMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - tagsRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        tagsRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTagsMouseUp = () => {
        setIsMouseDown(false);
    };

    // Touch events for mobile
    const handleTagsTouchStart = (e) => {
        setIsMouseDown(true);
        setStartX(e.touches[0].pageX - tagsRef.current.offsetLeft);
        setScrollLeft(tagsRef.current.scrollLeft);
    };

    const handleTagsTouchMove = (e) => {
        if (!isMouseDown) return;
        const x = e.touches[0].pageX - tagsRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        tagsRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTagsTouchEnd = () => {
        setIsMouseDown(false);
    };
  
    const mainImageIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
    const mainImage = images[mainImageIndex];

    const handleSizeChange = (event) => {
      setSelectedSize(event.target.value);
    };


    const [totalRating, setTotalRating] = useState(0);
    useEffect(() => {
    if (productToDisplay?.review?.length > 0) {
        const sum = productToDisplay.review.reduce((acc, item) => acc + item.rating, 0);
        const average = sum / productToDisplay.review.length;
        setTotalRating(average);
    } else {
        setTotalRating(0); // or null
    }
    }, [productToDisplay.review]);

    const [productsModel,setProductsModel] =useState([]);
    
    useEffect(()=>{
        axios
          .post(`${baseURL}/api/product/get-color`, { modelName: productToDisplay.modelName })
        .then((res) => {
            setProductsModel(res.data.message);
            })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
        });
    },[productToDisplay])
    
    // Check if product is in wishlist on component mount
    useEffect(() => {
        if (isAuthenticated && user) {
            const checkWishlist = async () => {
                try {
                    const response = await axios.get(`${baseURL}/api/user/wishlist/${user._id}`, {
                        withCredentials: true
                    });
                    setIsInWishlist(response.data.wishlist.some(item => item._id === productToDisplay._id));
                } catch (error) {
                    console.error('Error checking wishlist:', error);
                }
            };
            checkWishlist();
        }
    }, [isAuthenticated, user, productToDisplay._id]);

    useEffect(() => {
        // Fetch similar products based on category and brand
        const fetchSimilarProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/product/get`, {
                    params: {
                        category: productToDisplay.category,
                        brand: productToDisplay.brand,
                        limit: 4 // Limit to 4 similar products
                    }
                });
                
                // Filter out the current product and limit to 4 items
                const filtered = response.data.products
                    .filter(product => product._id !== productToDisplay._id)
                    .slice(0, 4);
                
                setSimilarProducts(filtered);
            } catch (error) {
                console.error('Error fetching similar products:', error);
            }
        };

        fetchSimilarProducts();
    }, [productToDisplay]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');
        console.log(productToDisplay);
        try {
            const response = await axios.post(`${baseURL}/api/user/cart/add`, {
                userId: user._id,
                productId: productToDisplay._id,
                quantity: 1,
                totalAmount: productToDisplay.price
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                // Show success message or update UI
                alert('Product added to cart successfully!');
                // Dispatch custom event for cart update
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add product to cart');
            console.error('Add to cart error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                // Remove from wishlist
                await axios.post(`${baseURL}/api/user/wishlist/remove`, {
                    userId: user._id,
                    productId: productToDisplay._id
                }, {
                    withCredentials: true
                });
                setIsInWishlist(false);
            } else {
                // Add to wishlist
                await axios.post(`${baseURL}/api/user/wishlist/add`, {
                    userId: user._id,
                    productId: productToDisplay._id
                }, {
                    withCredentials: true
                });
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Wishlist operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
        <div className='font-roboto text-regularTextPhone md:text-regularText flex flex-col md:flex-row lg:px-[2vw] gap-[6vw] md:gap-[1.5vw]'>

            {/* Product Images */}
            <div className='flex flex-col w-full md:w-[53.6875vw] gap-[3vw] md:gap-[1.5vw]'> 
            <div className='flex flex-col-reverse md:flex-row  md:h-[47.75vw] w-full gap-[3vw] md:gap-[1.125vw]'>
                {/* Thumbnails */}
                <div className="flex flex-row md:flex-col   md:h-[46.75vw] overflow-y-auto gap-[2vw] md:gap-[1vw] hide-scrollbar">
                    {images.map((img, index) => {
                    // ❗ Only hide the selected image (not hovered)

                    return (
                        <img
                                key={index}
                                src={img}
                                className={`h-[28vw] md:h-[7vw] w-[28vw] md:w-[6.875vw] bg-white rounded-[2.5vw] md:rounded-[10px] cursor-pointer clickable object-cover ${index==selectedIndex?"border-[2px] border-black":"border-[1px] border-gray-600"}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => setSelectedIndex(index)}
                                />
                            );
                            })}
                        </div>

            {/* Main Image with smooth transition */}
            <div className="relative h-full w-full md:w-[45.6875vw] ml-0 md:ml-4 overflow-hidden bg-white rounded-[5vw] md:rounded-[2vw]">
            <img
                key={mainImage} // ⚠️ important: force re-render on image change
                src={mainImage}
                className="h-full w-full object-cover clickable transition-all duration-500 ease-in-out p-[5vw] md:p-[2vw] opacity-0 animate-fade-in"
            />
            <div className='absolute top-[3vw] md:top-[1vw] right-[3vw] md:right-[1vw] flex z-50 gap-[2vw] md:gap-[8px] items-center'>
                <div 
                    ref={tagsRef}
                    className='relative flex gap-[2vw] md:gap-[8px] overflow-x-auto hide-scrollbar scroll-smooth cursor-grab active:cursor-grabbing'
                    style={{ maxWidth: '50vw', WebkitOverflowScrolling: 'touch' }}
                    onMouseDown={handleTagsMouseDown}
                    onMouseLeave={handleTagsMouseLeave}
                    onMouseMove={handleTagsMouseMove}
                    onMouseUp={handleTagsMouseUp}
                    onTouchStart={handleTagsTouchStart}
                    onTouchMove={handleTagsTouchMove}
                    onTouchEnd={handleTagsTouchEnd}
                >
                    {tags.map((tag, index) => (
                    <div className='px-[4vw] md:px-[16px] py-[2vw] md:py-[8px] rounded-[5vw] md:rounded-[1.25vw] text-center line-clamp-1 whitespace-nowrap md:min-w-[7.125vw] flex-shrink-0 border-[1px] border-black text-tinyTextPhone md:text-tinyText select-none' key={index}>{tag}</div>
                    ))}
                </div>
                <button onClick={handleWishlist} disabled={loading} className='flex-shrink-0'>
                    <img 
                        className='w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw]' 
                        src={isInWishlist ? WishListIconFilled : WishListIcon}
                        alt={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    />
                </button>
            </div>
            </div>

                
                </div>
            </div>

            {/* Product Description */}
            <div className='w-full md:w-[41.8125vw] lg:w-[37.8125vw]'>
            <div className='flex flex-col gap-[4vw] md:gap-[1.5vw] w-full md:w-[41.8125vw] lg:w-[37.8125vw]'>
                {/* Product Details block */}
                <img src={mapBrandToLogo[productToDisplay.brand]} alt={productToDisplay.brand} className='w-auto h-[10vw] md:h-[2.5vw] mr-auto object-contain' />
                <div>
                    <h3 className='font-bold text-h3TextPhone md:text-h3Text leading-[120%]'>{productToDisplay.modelName}</h3>
                    <span className='text-regularTextPhone md:text-regularText leading-[150%]'>{productToDisplay.modelTitle}</span>
                    {/* <h5 className='text-h5Text font-bold leading-[140%]'><span className='line-through'>{formatINR(productToDisplay.price)}</span> {" "}
                     <span>{formatINR(productToDisplay.discount)}</span> </h5> */}

                    <h5 className='text-h5TextPhone md:text-h5Text font-bold leading-[140%] mt-[1vw] md:mt-0'>{formatINR(productToDisplay.price)}</h5>
                </div>
                
                {/* Rating block */}
                <div className='text-regularTextPhone md:text-regularText'>
                    {totalRating>0?<span>{renderStars(totalRating)} {" - "} {productToDisplay.review.length} </span>:"No Reviews"}
                </div>
                <p className='leading-[150%] text-regularTextPhone md:text-regularText'>{productToDisplay.description}</p>
                {/* Size block */}
                <div className='flex flex-col gap-[.5vw]'>
                    {/* <div className='flex flex-row  '>
                        <span>Size</span>
                        <span className='ml-auto underline'>Size chart</span>
                    </div> */}

                    {/* Custom dropdown menu */}
                    {/* <div className='relative w-full group ' onClick={()=>setIsHovered(!isHovered)}  >
                    
                    <div className="w-full appearance-none rounded-[2vw] focus:outline-none p-[.75vw] border-black border-[1px] cursor-pointer">
                        <div className='flex flex-row items-center transition-transform ease-in-out '>
                        <p>{selectedSize || 'Select a size'}</p>
                        <div className="pointer-events-none absolute right-[1vw] transform transition-transform duration-300 rotate-180     " style={{ transform:isHovered? 'rotate(180deg)':'rotate(0deg)' }}  >
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
                            {product.sizes.map((size, index) => (
                                <div
                                key={index}
                                className="p-[.75vw] hover:bg-gray-200 cursor-pointer"
                                onClick={() => {    
                                    setSelectedSize(size);
                                    setIsHovered(false);
                                    set
                                }}
                                >
                                {size}
                                </div>
                            ))}
                            </div>
                        )}

                    
                    </div> */}
                    
                </div>

                {/* Variant block */}
                <div className='flex flex-col gap-[2vw] md:gap-[.5vw]'>
                        <div className='flex flex-row gap-[2vw] md:gap-[.5vw] overflow-x-auto hide-scrollbar'>
                            {productsModel.map((variant,index)=>{
                                const colorAttribute = variant.frameAttributes.find(attr => attr.name === "Color");
                                const colorValue = colorAttribute ? colorAttribute.value : null;

                                const lensColorAttribute = variant.lensAttributes.find(attr => attr.name === "Lens Color");
                                const lensColorValue = lensColorAttribute ? lensColorAttribute.value : null;
                                return (
                                variant._id==productToDisplay._id?
                                <div key={index} className={`rounded-[2vw] md:rounded-[8px] w-[50vw] md:w-[12.5vw] p-[3vw] md:p-[12px] bg-white border-[1px] flex-shrink-0 ${variant._id==productToDisplay._id?"border-black":""}`}>
                                   <img className='w-full md:w-[10vw] h-[30vw] md:h-[6vw] object-cover mx-auto mb-[2vw] md:mb-[8px]' src={variant.images[0]} />
                                   {colorAttribute && <div className='w-full flex justify-between mb-[2vw] md:mb-[8px] text-smallTextPhone md:text-smallText'>
                                    <span>Color</span>
                                    <span>{colorValue}</span>
                                   </div>}
                                   {lensColorAttribute && <div className='w-full flex justify-between text-smallTextPhone md:text-smallText'>
                                    <span>Lens Color</span>
                                    <span>{lensColorValue}</span>
                                   </div>}
                                </div>
                                :<TransitionLink to={`/product/${variant._id}`}>
                                <div className={`rounded-[2vw] md:rounded-[8px] w-[50vw] md:w-[12.5vw] p-[3vw] md:p-[12px] border-[1px] bg-white flex-shrink-0`}>
                                   <img className='w-full md:w-[10vw] h-[30vw] md:h-[6vw] object-cover mx-auto mb-[2vw] md:mb-[8px]' src={variant.images[0]} />
                                   {colorAttribute && <div className='w-full flex justify-between mb-[2vw] md:mb-[8px] text-smallTextPhone md:text-smallText'>
                                    <span>Color</span>
                                    <span>{colorValue}</span>
                                   </div>}
                                   {lensColorAttribute && <div className='w-full flex justify-between text-smallTextPhone md:text-smallText'>
                                    <span>Lens Color</span>
                                    <span>{lensColorValue}</span>
                                   </div>}
                                </div>
                                </TransitionLink>
                            )})}
                        </div>
                </div>

                {/* Buy and add to cart button */}
                <div className='flex flex-col md:flex-row gap-[3vw] md:gap-[1vw] mx-auto w-full md:w-auto'>
                     <button 
                        onClick={handleAddToCart}
                        disabled={loading}
                        className= {`rounded-[14vw] md:rounded-[3.5vw] h-[16vw] md:h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] text-white bg-darkslategrey disabled:bg-gray-400 text-regularTextPhone md:text-regularText ${productToDisplay.rx?"w-full md:w-[16vw]":"w-full md:w-[32vw]"}`}
                    >
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                    {productToDisplay.rx && (
                        <TransitionLink to={`/lens/${productToDisplay._id}`} className='w-full md:w-auto'>
                        <button className='w-full md:w-[16vw] rounded-[14vw] md:rounded-[3.5vw] h-[16vw] md:h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] bg-btngrery text-regularTextPhone md:text-regularText'>
                        Select Lenses
                     </button>
                        </TransitionLink>
                    )}
                </div>
                {error && <p className='text-red-500 text-center mt-2 text-regularTextPhone md:text-regularText'>{error}</p>}
                {/* Notice  */}
                <p className='text-center text-smallTextPhone md:text-smallText'>Free shipping over Rs. 999</p>
            </div>


            </div>
        </div>

        {/* Product Details */}
        {productToDisplay.frameAttributes.length + productToDisplay.lensAttributes.length + productToDisplay.generalAttributes.length > 0 &&<div className='bg-white rounded-[4vw] md:rounded-[16px] mt-[6vw] md:mt-[2vw] py-[6vw] md:py-[2.25vw] px-[5vw] md:px-[3vw] flex flex-col gap-[6vw] md:gap-[2.5vw]'>
            <h2 className='font-dyeLine text-h3TextPhone md:text-h3Text font-semibold'>Product Detail</h2>
            {
                productToDisplay.frameAttributes.length>0 && 
                <div>

                    <h4 className='text-h4TextPhone md:text-h4Text font-dyeLine font-semibold mb-[3vw] md:mb-0'>Frame</h4>
                    <div className='flex flex-wrap gap-[4vw] md:gap-[2vw]'>
                        {productToDisplay.frameAttributes.map((item,index)=>(
                            <div className='text-regularTextPhone md:text-regularText' key={index}>
                                <p>{item.name}</p>
                                <p className='font-semibold'>{item.value}</p>
                                </div>
                        ))}
                    </div>
                    </div>
            }
            {
                productToDisplay.lensAttributes.length>0 && 
                <div>

                    <h4 className='text-h4TextPhone md:text-h4Text font-dyeLine font-semibold mb-[3vw] md:mb-0'>Lens</h4>
                    <div className='flex flex-wrap gap-[4vw] md:gap-[2vw]'>
                        {productToDisplay.lensAttributes.map((item,index)=>(
                            <div className='text-regularTextPhone md:text-regularText' key={index}>
                                <p>{item.name}</p>
                                <p className='font-semibold'>{item.value}</p>
                                </div>
                        ))}
                    </div>
                    </div>
            }
            {
                productToDisplay.generalAttributes.length>0 && 
                <div>

                    <h4 className='text-h4TextPhone md:text-h4Text font-dyeLine font-semibold mb-[3vw] md:mb-0'>General</h4>
                    <div className='flex flex-wrap gap-[4vw] md:gap-[2vw]'>
                        {productToDisplay.generalAttributes.map((item,index)=>(
                            <div className='text-regularTextPhone md:text-regularText' key={index}>
                                <p>{item.name}</p>
                                <p className='font-semibold'>{item.value}</p>
                                </div>
                        ))}
                    </div>
                    </div>
            }
        </div>}

        {/* Product Description */}
        <div className='bg-white rounded-[4vw] md:rounded-[16px] mt-[6vw] md:mt-[2vw] py-[6vw] md:py-[2.25vw] px-[5vw] md:px-[3vw] flex flex-col gap-[6vw] md:gap-[2.5vw]'>
            <h2 className='font-dyeLine text-h3TextPhone md:text-h3Text font-semibold'>Seller Information</h2>
            <div className='flex flex-col md:flex-row mx-auto items-center gap-[6vw] md:gap-[7.5vw]'>
                <img src={mapBrandToLogo[productToDisplay.brand]} alt={productToDisplay.brand}  className='w-auto h-[36vw] md:h-[9vw] object-contain' />
                <div className='w-full md:w-[45vw]'>
                    <p className='text-regularTextPhone md:text-regularText text-center md:text-left'>{mapBrandToDescription[productToDisplay.brand]}</p>
                </div>
            </div>
        </div>

        {/* Similar Products */}
        <div className='bg-white rounded-[4vw] md:rounded-[16px] mt-[6vw] md:mt-[2vw] py-[6vw] md:py-[2.25vw] px-[5vw] md:px-[3vw] flex flex-col gap-[6vw] md:gap-[2.5vw]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-dyeLine text-h3TextPhone md:text-h3Text font-semibold'>Similar Products</h2>
                <button className='text-regularTextPhone md:text-regularText hover:underline'>View all</button>
            </div>
            <p className='text-regularTextPhone md:text-regularText'>You might like these products too....</p>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-[1vw]'>
                {similarProducts.map((product, index) => (
                    <TransitionLink to={`/product/${product._id}`} key={product._id}>
                        <div className='relative bg-white rounded-[2.5vw] md:rounded-[10px] overflow-hidden border border-gray-200'>
                            <div className='relative aspect-w-1 aspect-h-1'>
                                <img 
                                    src={product.images[0]} 
                                    alt={product.modelTitle}
                                    className='w-full h-full object-cover clickable'
                                />
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWishlist(product._id);
                                    }}
                                    className='absolute top-[2vw] md:top-2 right-[2vw] md:right-2'
                                >
                                    <img 
                                        src={isInWishlist ? WishListIconFilled : WishListIcon}
                                        alt="wishlist"
                                        className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw]'
                                    />
                                </button>
                            </div>
                            <div className='p-[3vw] md:p-[1vw]'>
                                <div className='flex items-center justify-between mb-[1vw] md:mb-1'>
                                    <span className='font-medium text-smallTextPhone md:text-regularText'>{product.brand}</span>
                                    <span className='text-tinyTextPhone md:text-sm'>{product.review?.length > 0 ? `${renderStars(product.review.reduce((acc, item) => acc + item.rating, 0) / product.review.length)} • ${product.review.length}` : "No Reviews"}</span>
                                </div>
                                <h3 className='font-bold text-h6TextPhone md:text-h6Text mb-[1vw] md:mb-1'>{product.modelTitle}</h3>
                                <p className='text-tinyTextPhone md:text-sm text-gray-600'>{product.modelName}</p>
                                <div className='mt-[2vw] md:mt-2'>
                                    <span className='font-bold text-smallTextPhone md:text-regularText'>{formatINR(product.discount)}</span>
                                    {product.price !== product.discount && (
                                        <span className='ml-2 text-tinyTextPhone md:text-sm line-through text-gray-500'>{formatINR(product.price)}</span>
                                    )}
                                </div>
                                <button className='w-full mt-[2vw] md:mt-2 py-[2vw] md:py-2 bg-btngrery rounded-[8vw] md:rounded-full text-smallTextPhone md:text-sm font-medium hover:bg-gray-200 transition-colors'>
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </TransitionLink>
                ))}
            </div>
        </div>
        </div>
    );
};
