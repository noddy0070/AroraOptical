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
        axios.post(`${baseURL}/api/admin/get-products-color`,{modelName:productToDisplay.modelName}, {
            withCredentials: true
          })
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
                const response = await axios.get(`${baseURL}/api/admin/get-products`, {
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
        try {
            const response = await axios.post(`${baseURL}/api/user/cart/add`, {
                userId: user._id,
                productId: productToDisplay._id,
                quantity: 1
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
        <div className='font-roboto text-regularText flex  flex-row lg:px-[2vw] gap-[1.5vw]'>

            {/* Product Images */}
            <div className='flex flex-col w-[53.6875vw] gap-[1.5vw]'> 
            <div className='flex flex-row h-[47.75vw]  w-full gap-[1.125vw]'>
                {/* Thumbnails */}
                <div className="flex  flex-col h-[46.75vw] overflow-y-auto gap-[1vw] hide-scrollbar">
                    {images.map((img, index) => {
                    // ❗ Only hide the selected image (not hovered)

                    return (
                        <img
                                key={index}
                                src={img}
                                className={`h-[7vw] w-[6.875vw] bg-white  rounded-[10px] cursor-pointer clickable object-cover ${index==selectedIndex?"border-[2px] border-black":"border-[1px] border-gray-600"}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => setSelectedIndex(index)}
                                />
                            );
                            })}
                        </div>

            {/* Main Image with smooth transition */}
            <div className="relative  h-full w-[45.6875vw] ml-4 overflow-hidden bg-white  rounded-[2vw]   ">
            <img
                key={mainImage} // ⚠️ important: force re-render on image change
                src={mainImage}
                className="h-full w-full object-cover clickable transition-all duration-500 ease-in-out p-[2vw] opacity-0 animate-fade-in "
            />
            <div className='absolute top-[1vw] right-[1vw] flex gap-[8px] '>
                {tags.map((tag, index) => (
                <div className=' px-[16px]  py-[8px] rounded-[1.25vw] text-center md:min-w-[7.125vw] border-[1px] border-black text-tinyTextPhone md:text-tinyText' key={index}>{tag}</div>
                ))}
                <button onClick={handleWishlist} disabled={loading}>
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
            <div className=' w-[41.8125vw] lg:w-[37.8125vw]'>
            <div className='flex flex-col gap-[1.5vw] w-[41.8125vw] lg:w-[37.8125vw] '>
                {/* Product Details block */}
                <img src={mapBrandToLogo[productToDisplay.brand]} alt="sf" className='w-auto h-[2.5vw] mr-auto object-contain' />
                <div>
                    <h3 className='  font-bold text-h3Text leading-[120%]  ' >{productToDisplay.modelTitle}</h3>
                    <span className='leading-[150%]'>{productToDisplay.modelName}</span>
                    <h5 className='text-h5Text font-bold leading-[140%]'><span className='line-through'>{formatINR(productToDisplay.price)}</span> {" "}
                     <span>{formatINR(productToDisplay.discount)}</span> </h5>
                </div>
                
                {/* Rating block */}
                {totalRating>0?<span>{renderStars(totalRating)} {" - "} {productToDisplay.review.length} </span>:"No Reviews"}
                <p className='leading-[150%]'>{productToDisplay.description}</p>
                {/* Size block */}
                <div className='flex flex-col gap-[.5vw]'>
                    <div className='flex flex-row  '>
                        <span>Size</span>
                        <span className='ml-auto underline'>Size chart</span>
                    </div>

                    {/* Custom dropdown menu */}
                    <div className='relative w-full group ' onClick={()=>setIsHovered(!isHovered)}  >
                    
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

                    
                    </div>
                    
                </div>

                {/* Variant block */}
                <div className='flex flex-col gap-[.5vw] '>
                        <div className='flex flex-row gap-[.5vw] overflow-x-auto '>
                            {productsModel.map((variant,index)=>{
                                const colorAttribute = variant.frameAttributes.find(attr => attr.name === "Color");
                                const colorValue = colorAttribute ? colorAttribute.value : null;

                                const lensColorAttribute = variant.lensAttributes.find(attr => attr.name === "Lens Color");
                                const lensColorValue = lensColorAttribute ? lensColorAttribute.value : null;
                                return (
                                variant._id==productToDisplay._id?
                                <div className={`rounded-[8px] w-[12.5vw] p-[12px] bg-white border-[1px] ${variant._id==productToDisplay._id?"border-black":""    } `}>
                                   <img className='w-[10vw] h-[6vw] object-cover mx-auto mb-[8px]' src={variant.images[0]} />
                                   {colorAttribute && <div className='w-full flex justify-between mb-[8px]'>
                                    <span>Color</span>
                                    <span>{colorValue}</span>
                                   </div>}
                                   {lensColorAttribute && <div className='w-full flex justify-between'>
                                    <span>Lens Color</span>
                                    <span>{lensColorValue}</span>
                                   </div>}
                                </div>
                                :<TransitionLink to={`/product/${variant._id}`}>
                                <div className={`rounded-[8px] w-[12.5vw] p-[12px] border-[1px] bg-white `}>
                                   <img className='w-[10vw] h-[6vw] object-cover mx-auto mb-[8px]' src={variant.images[0]} />
                                   {colorAttribute && <div className='w-full flex justify-between mb-[8px]'>
                                    <span>Color</span>
                                    <span>{colorValue}</span>
                                   </div>}
                                   {lensColorAttribute && <div className='w-full flex justify-between'>
                                    <span>Lens Color</span>
                                    <span>{lensColorValue}</span>
                                   </div>}
                                </div>
                                </TransitionLink>
                            )})}
                        </div>
                </div>

                {/* Buy and add to cart button */}
                <div className='flex flex-row gap-[1vw] mx-auto'>
                     <button 
                        onClick={handleAddToCart}
                        disabled={loading}
                        className= {` rounded-[3.5vw] h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] text-white bg-darkslategrey disabled:bg-gray-400 ${productToDisplay.rx?"w-[16vw]":"w-[32vw]"}`}
                    >
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                    {productToDisplay.rx && (
                        <TransitionLink to={`/lens/${productToDisplay._id}`}>
                        <button className='w-[16vw] rounded-[3.5vw] h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] bg-btngrery'>
                        Select Lenses
                     </button>
                        </TransitionLink>
                    )}
                </div>
                {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
                {/* Notice  */}
                <p className='text-center text-smallText'>Free shipping over Rs. 999</p>
            </div>


            </div>
        </div>

        {/* Product Details */}
        <div className='bg-white rounded-[16px] mt-[2vw] py-[2.25vw] px-[3vw] flex flex-col gap-[2.5vw] '>
            <h2 className='font-dyeLine text-h3Text font-semibold'>Product Detail</h2>
            {
                productToDisplay.frameAttributes.length>0 && 
                <div>

                    <h4 className='text-h4Text font-dyeLine font-semibold '>Frame</h4>
                    <div className='flex flex-wrap gap-[2vw]'>
                        {productToDisplay.frameAttributes.map((item,index)=>(
                            <div className='text-regularText' key={index}>
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

                    <h4 className='text-h4Text font-dyeLine font-semibold '>Lens</h4>
                    <div className='flex flex-wrap gap-[2vw]'>
                        {productToDisplay.lensAttributes.map((item,index)=>(
                            <div className='text-regularText' key={index}>
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

                    <h4 className='text-h4Text font-dyeLine font-semibold '>General</h4>
                    <div className='flex flex-wrap gap-[2vw]'>
                        {productToDisplay.generalAttributes.map((item,index)=>(
                            <div className='text-regularText' key={index}>
                                <p>{item.name}</p>
                                <p className='font-semibold'>{item.value}</p>
                                </div>
                        ))}
                    </div>
                    </div>
            }
        </div>

        {/* Product Description */}
        <div className='bg-white rounded-[16px] mt-[2vw] py-[2.25vw] px-[3vw] flex flex-col gap-[2.5vw] '>
            <h2 className='font-dyeLine text-h3Text font-semibold'>Seller Information</h2>
            <div className='flex flex-row  mx-auto items-center gap-[7.5vw]'>
                <img src={mapBrandToLogo[productToDisplay.brand]} alt={productToDisplay.brand}  className='w-auto h-[9vw]  object-contain' />
                <div className='w-[45vvw]'>
                    <p className='text-regularText'>{mapBrandToDescription[productToDisplay.brand]}</p>
                </div>
            </div>
        </div>

        {/* Similar Products */}
        <div className='bg-white rounded-[16px] mt-[2vw] py-[2.25vw] px-[3vw] flex flex-col gap-[2.5vw]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-dyeLine text-h3Text font-semibold'>Similar Products</h2>
                <button className='text-regularText hover:underline'>View all</button>
            </div>
            <p className='text-regularText'>You might like these products too....</p>
            
            <div className='grid grid-cols-4 gap-[1vw]'>
                {similarProducts.map((product, index) => (
                    <TransitionLink to={`/product/${product._id}`} key={product._id}>
                        <div className='relative bg-white rounded-[10px] overflow-hidden border border-gray-200'>
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
                                    className='absolute top-2 right-2'
                                >
                                    <img 
                                        src={isInWishlist ? WishListIconFilled : WishListIcon}
                                        alt="wishlist"
                                        className='w-[1.5vw] h-[1.5vw]'
                                    />
                                </button>
                            </div>
                            <div className='p-[1vw]'>
                                <div className='flex items-center justify-between mb-1'>
                                    <span className='font-medium'>{product.brand}</span>
                                    <span className='text-sm'>{product.review?.length > 0 ? `${renderStars(product.review.reduce((acc, item) => acc + item.rating, 0) / product.review.length)} • ${product.review.length}` : "No Reviews"}</span>
                                </div>
                                <h3 className='font-bold text-h6Text mb-1'>{product.modelTitle}</h3>
                                <p className='text-sm text-gray-600'>{product.modelName}</p>
                                <div className='mt-2'>
                                    <span className='font-bold'>{formatINR(product.discount)}</span>
                                    {product.price !== product.discount && (
                                        <span className='ml-2 text-sm line-through text-gray-500'>{formatINR(product.price)}</span>
                                    )}
                                </div>
                                <button className='w-full mt-2 py-2 bg-btngrery rounded-full text-sm font-medium hover:bg-gray-200 transition-colors'>
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
