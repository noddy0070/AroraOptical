import {useState,useRef,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import WishListIcon from '../../assets/images/icons/WishlistIcon.svg'
import WishListIconFilled from '../../assets/images/icons/WishlistIconFilled.svg'
import './product.css';
import { renderStars } from '@/components/RenderStarts';
import { toast } from 'react-toastify';
import axios from 'axios';
import { formatINR } from '@/components/IntToPrice';
import { baseURL } from '@/url';
import { TransitionLink } from '@/Routes/TransitionLink';
import { mapBrandToLogo, mapBrandToDescription } from '@/data/brandMap';
import {toTitleCase} from '../../../shared/pipes/strFormatting';

export default function ProductDescription({productToDisplay}){
    const [selectedSize, setSelectedSize] = useState('');
    const [wishlistIds, setWishlistIds] = useState(new Set());
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



    const [reviews, setReviews] = useState(productToDisplay.reviews || []);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const [totalRating, setTotalRating] = useState(0);
    useEffect(() => {
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
            setTotalRating(sum / reviews.length);
        } else {
            setTotalRating(0);
        }
    }, [reviews]);

    const handleSubmitReview = async () => {
        if (newReviewRating === 0) return;
        setReviewSubmitting(true);
        setReviewError('');
        try {
            const response = await axios.post(
                `${baseURL}/api/product/${productToDisplay._id}/review`,
                { userId: user._id, rating: newReviewRating, comment: newReviewComment },
                { withCredentials: true }
            );
            setReviews(prev => [...prev, response.data.review]);
            setNewReviewRating(0);
            setNewReviewComment('');
            toast.success('Review submitted!');
        } catch (error) {
            setReviewError(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const [productsModel,setProductsModel] =useState([]);
    
    useEffect(()=>{
        axios
          .post(`${baseURL}/api/product/get-color`, { modelCode: productToDisplay.modelCode })
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
                    setWishlistIds(new Set(response.data.wishlist.map(item => item._id)));
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

    const hasSizes = productToDisplay.size?.length > 0;

    // isSellable is stored as the string "true"/"false" on the Product model, not a boolean
    const isSellable = String(productToDisplay.isSellable).toLowerCase() !== 'false';
    const productLink = `${window.location.origin}/product/${productToDisplay._id}`;
    const whatsappMessage = encodeURIComponent(`I want to buy this product ${productLink}`);
    const whatsappContactUrl = `https://wa.me/919415031678?text=${whatsappMessage}`;

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (hasSizes && !selectedSize) {
            setError('Please select a size before adding to cart.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const payload = {
                userId: user._id,
                productId: productToDisplay._id,
                quantity: 1,
                totalAmount: productToDisplay.price,
            };
            if (selectedSize) payload.size = selectedSize;

            const response = await axios.post(`${baseURL}/api/user/cart/add`, payload, {
                withCredentials: true
            });

            if (response.data.success) {
                // Show success message or update UI
                toast.success('Added to cart!');
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

    const handleWishlist = async (productId = productToDisplay._id) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const inWishlist = wishlistIds.has(productId);
        try {
            if (inWishlist) {
                await axios.post(`${baseURL}/api/user/wishlist/remove`, { userId: user._id, productId }, { withCredentials: true });
                setWishlistIds(prev => { const next = new Set(prev); next.delete(productId); return next; });
            } else {
                await axios.post(`${baseURL}/api/user/wishlist/add`, { userId: user._id, productId }, { withCredentials: true });
                setWishlistIds(prev => new Set([...prev, productId]));
            }
        } catch (error) {
            console.error('Wishlist operation error:', error);
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
                                className={`h-[28vw] md:h-[7vw] w-[28vw] md:w-[6.875vw] bg-white rounded-[2.5vw] md:rounded-[10px] cursor-pointer clickable object-contain ${index==selectedIndex?"border-[2px] border-black":"border-[1px] border-gray-600"}`}
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
                className="h-full w-full object-contain clickable transition-all duration-500 ease-in-out p-[5vw] md:p-[2vw] opacity-0 animate-fade-in"
            />
            <div className='absolute top-[3vw] md:top-[1vw] right-[3vw] md:right-[1vw] flex z-20 gap-[2vw] md:gap-[8px] items-center'>
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
                    {tags.slice(0, 3).map((tag, index) => (
                    <div className='px-[4vw] md:px-[16px] py-[2vw] md:py-[8px] rounded-[5vw] md:rounded-[1.25vw] text-center line-clamp-1 whitespace-nowrap md:min-w-[7.125vw] flex-shrink-0 border-[1px] border-black text-tinyTextPhone md:text-tinyText select-none font-medium' key={index}>{toTitleCase(tag)}</div>
                    ))}
                </div>
                <button onClick={() => handleWishlist()} className='flex-shrink-0'>
                    <img
                        className={`w-[8vw] md:w-[1.75vw] h-[8vw] md:h-[1.75vw] transition-all duration-200 ${!wishlistIds.has(productToDisplay._id) ? 'wishlist-hover' : ''}`}
                        src={wishlistIds.has(productToDisplay._id) ? WishListIconFilled : WishListIcon}
                        alt={wishlistIds.has(productToDisplay._id) ? "Remove from Wishlist" : "Add to Wishlist"}
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
                    <span className='text-regularTextPhone md:text-regularText leading-[150%]'><pre>{productToDisplay.modelCode} - {productToDisplay.modelTitle}</pre></span>
                    {/* <h5 className='text-h5Text font-bold leading-[140%]'><span className='line-through'>{formatINR(productToDisplay.price)}</span> {" "}
                     <span>{formatINR(productToDisplay.discount)}</span> </h5> */}

                    <h5 className='text-h5TextPhone md:text-h5Text font-bold leading-[140%] mt-[1vw] md:mt-0'>{formatINR(productToDisplay.price)}</h5>
                </div>
                
                {/* Rating block */}
                <div className='text-regularTextPhone md:text-regularText'>
                    {totalRating > 0 ? <span>{renderStars(totalRating)} {" - "} {reviews.length} reviews</span> : "No Reviews"}
                </div>
                <p className='leading-[150%] text-regularTextPhone md:text-regularText'>{productToDisplay.description}</p>
                {/* Size block */}
                {hasSizes && (
                <div className='flex flex-col gap-[2vw] md:gap-[.5vw]'>
                    <p className='text-regularTextPhone md:text-regularText font-medium'>Select Size</p>
                    <div className='flex flex-row flex-wrap gap-[2vw] md:gap-[.5vw]'>
                        {productToDisplay.size.map((size, index) => {
                            const stockCount = Number(productToDisplay.stock[index]) || 0;
                            const isOutOfStock = stockCount === 0;
                            const isSelected = selectedSize === size;
                            return (
                                <button
                                    key={index}
                                    disabled={isOutOfStock}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-[4vw] md:px-[1vw] py-[2vw] md:py-[.4vw] rounded-[2vw] md:rounded-[6px] border text-regularTextPhone md:text-regularText transition-colors
                                        ${isOutOfStock ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through' : ''}
                                        ${isSelected && !isOutOfStock ? 'border-black bg-black text-white' : ''}
                                        ${!isSelected && !isOutOfStock ? 'border-gray-300 text-gray-700 hover:border-black' : ''}
                                    `}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                    {!selectedSize && <p className='text-[2.5vw] md:text-xs text-amber-600'>Please select a size to continue</p>}
                </div>
                )}

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
                     {!isSellable ? (
                        <a
                            href={whatsappContactUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`flex items-center justify-center gap-[2vw] md:gap-[.5vw] rounded-[14vw] md:rounded-[3.5vw] h-[16vw] md:h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] text-white bg-[#25D366] text-regularTextPhone md:text-regularText ${productToDisplay.rx?"w-full md:w-[16vw]":"w-full md:w-[32vw]"}`}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className='w-[5vw] h-[5vw] md:w-[1.25vw] md:h-[1.25vw]'>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.986.583 3.833 1.588 5.383L2 22l4.766-1.55A9.94 9.94 0 0 0 12.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2zm0 18.19a8.17 8.17 0 0 1-4.166-1.14l-.299-.177-2.828.919.925-2.756-.194-.283A8.15 8.15 0 0 1 3.83 12c0-4.51 3.674-8.19 8.174-8.19 4.5 0 8.174 3.68 8.174 8.19 0 4.51-3.674 8.19-8.174 8.19z"/>
                            </svg>
                            Contact Us
                        </a>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || (hasSizes && !selectedSize)}
                            className= {`rounded-[14vw] md:rounded-[3.5vw] h-[16vw] md:h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] text-white bg-darkslategrey disabled:bg-gray-400 disabled:cursor-not-allowed text-regularTextPhone md:text-regularText ${productToDisplay.rx?"w-full md:w-[16vw]":"w-full md:w-[32vw]"}`}
                        >
                            {loading ? 'Adding...' : 'Add to Cart'}
                        </button>
                    )}
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

        {/* Reviews Section */}
        <div className='bg-white rounded-[4vw] md:rounded-[16px] mt-[6vw] md:mt-[2vw] py-[6vw] md:py-[2.25vw] px-[5vw] md:px-[3vw] flex flex-col gap-[6vw] md:gap-[2vw]'>

            {/* Header */}
            <div className='flex justify-between items-start'>
                <div>
                    <h2 className='font-dyeLine text-h3TextPhone md:text-h3Text font-bold'>Customer Reviews</h2>
                    <p className='text-tinyTextPhone md:text-sm text-gray-500 mt-[1vw] md:mt-[4px]'>Share your experience to help other shoppers.</p>
                </div>
                <button
                    onClick={() => {
                        if (!isAuthenticated) { navigate('/login'); return; }
                        setShowReviewForm(v => !v);
                    }}
                    className='flex-shrink-0 px-[5vw] md:px-[1.5vw] py-[2.5vw] md:py-[10px] bg-[#f5e4be] text-black rounded-[8vw] md:rounded-full text-regularTextPhone md:text-regularText font-medium hover:bg-[#ebd5a5] transition-colors'
                >Rate Now</button>
            </div>

            {/* Rating Overview + Breakdown */}
            <div className='flex flex-col md:flex-row gap-[4vw] md:gap-[4vw] items-center md:items-start'>
                {/* Big number */}
                <div className='flex flex-col items-center gap-[1vw] md:gap-[4px]'>
                    <span className='text-[14vw] md:text-[4vw] font-bold leading-none'>{reviews.length > 0 ? totalRating.toFixed(1) : '—'}</span>
                    <div className='flex gap-[1vw] md:gap-[3px]'>
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-[5vw] md:text-[1.1vw] ${s <= Math.round(totalRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                        ))}
                    </div>
                    <span className='text-tinyTextPhone md:text-sm text-gray-400'>of {reviews.length} reviews</span>
                </div>

                {/* Breakdown bars */}
                <div className='flex-1 w-full flex flex-col gap-[2vw] md:gap-[8px]'>
                    {[
                        { label: 'Excellent', stars: 5 },
                        { label: 'Good', stars: 4 },
                        { label: 'Average', stars: 3 },
                        { label: 'Below Average', stars: 2 },
                        { label: 'Poor', stars: 1 },
                    ].map(({ label, stars }) => {
                        const count = reviews.filter(r => r.rating === stars).length;
                        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={stars} className='flex items-center gap-[2vw] md:gap-[10px]'>
                                <span className='text-tinyTextPhone md:text-sm text-gray-500 w-[22vw] md:w-[7.5vw] text-right flex-shrink-0'>{label}</span>
                                <div className='flex-1 h-[2.5vw] md:h-[7px] bg-gray-100 rounded-full overflow-hidden'>
                                    <div
                                        className='h-full bg-yellow-400 rounded-full transition-all duration-500'
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <span className='text-tinyTextPhone md:text-sm text-gray-400 w-[5vw] md:w-[1.5vw] text-left flex-shrink-0'>{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Form — toggled by Rate Now */}
            {showReviewForm && (
                <div className='border border-gray-200 rounded-[2vw] md:rounded-[8px] p-[4vw] md:p-[1.5vw] bg-gray-50'>
                    <h3 className='font-semibold text-regularTextPhone md:text-regularText mb-[3vw] md:mb-[1vw]'>Write a Review</h3>
                    <div className='flex gap-[2vw] md:gap-[6px] mb-[3vw] md:mb-[1vw]'>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => setNewReviewRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className={`text-[9vw] md:text-[2vw] transition-colors ${star <= (hoveredStar || newReviewRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >★</button>
                        ))}
                    </div>
                    <textarea
                        className='w-full border border-gray-300 rounded-[1.5vw] md:rounded-[6px] p-[2vw] md:p-[8px] text-regularTextPhone md:text-regularText resize-none focus:outline-none focus:border-gray-400 bg-white'
                        rows={3}
                        placeholder='Share your experience with this product...'
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                    />
                    {reviewError && <p className='text-red-500 text-tinyTextPhone md:text-sm mt-[1vw] md:mt-[4px]'>{reviewError}</p>}
                    <button
                        onClick={handleSubmitReview}
                        disabled={reviewSubmitting || newReviewRating === 0}
                        className='mt-[2vw] md:mt-[8px] px-[6vw] md:px-[1.5vw] py-[2.5vw] md:py-[8px] bg-darkslategrey text-white rounded-[8vw] md:rounded-full text-regularTextPhone md:text-regularText disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                    >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className='flex flex-row gap-[4vw] md:gap-[1.5vw] overflow-x-auto hide-scrollbar pb-[1vw] md:pb-[4px]'>
                    {reviews.map((review, index) => (
                        <div key={review._id || index} className='min-w-[80vw] md:min-w-[30vw] flex-shrink-0 flex flex-col gap-[2vw] md:gap-[10px] border border-gray-100 rounded-[2.5vw] md:rounded-[10px] p-[4vw] md:p-[1.25vw]'>
                            {/* Stars */}
                            <div className='flex gap-[1vw] md:gap-[3px]'>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span key={s} className={`text-[5vw] md:text-[1.1vw] ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                ))}
                            </div>
                            {/* Quote */}
                            <p className='text-regularTextPhone md:text-regularText text-gray-700 italic line-clamp-4 flex-1'>
                                "{review.comment || 'No comment provided.'}"
                            </p>
                            {/* Reviewer */}
                            <div className='flex items-center gap-[3vw] md:gap-[10px] mt-auto'>
                                <div className='w-[10vw] md:w-[2.5vw] h-[10vw] md:h-[2.5vw] rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 text-smallTextPhone md:text-sm font-semibold'>
                                    {(review.userId?.name || 'A')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className='font-semibold text-smallTextPhone md:text-regularText leading-tight'>{review.userId?.name || 'Anonymous'}</p>
                                    <p className='text-tinyTextPhone md:text-sm text-gray-400'>
                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center py-[6vw] md:py-[3vw] text-gray-400'>
                    <span className='text-[14vw] md:text-[3.5vw] leading-none mb-[2vw] md:mb-[8px]'>☆</span>
                    <p className='text-regularTextPhone md:text-regularText font-medium text-gray-600'>No reviews yet</p>
                    <p className='text-smallTextPhone md:text-smallText mt-[1vw] md:mt-[4px]'>Be the first to review this product</p>
                </div>
            )}
        </div>

        {/* Similar Products */}
        <div className='bg-white rounded-[4vw] md:rounded-[16px] mt-[6vw] md:mt-[2vw] py-[6vw] md:py-[2.25vw] px-[5vw] md:px-[3vw] flex flex-col gap-[6vw] md:gap-[2.5vw]'>
            <div className='flex justify-between items-center'>
                <h2 className='font-dyeLine text-h3TextPhone md:text-h3Text font-semibold'>Similar Products</h2>
                <button className='text-regularTextPhone md:text-regularText hover:underline'>View all</button>
            </div>
            <p className='text-regularTextPhone md:text-regularText'>You might like these products too....</p>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-[3vw] md:gap-[1vw]'>
                {similarProducts.map((product) => {
                    const inWishlist = wishlistIds.has(product._id);
                    return (
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
                                            src={inWishlist ? WishListIconFilled : WishListIcon}
                                            alt="wishlist"
                                            className={`w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw] transition-all duration-200 ${!inWishlist ? 'wishlist-hover' : ''}`}
                                        />
                                    </button>
                                </div>
                                <div className='p-[3vw] md:p-[1vw]'>
                                    <p className='text-tinyTextPhone md:text-xs text-gray-500 mb-[1vw] md:mb-0.5'>{product.brand}</p>
                                    <h3 className='font-bold text-h6TextPhone md:text-h6Text mb-[0.5vw] md:mb-0.5 line-clamp-1'>{product.modelName}</h3>
                                    <p className='text-tinyTextPhone md:text-xs text-gray-500 mb-[1vw] md:mb-1 line-clamp-1'>{[product.modelCode, product.modelTitle].filter(Boolean).join(' - ')}</p>
                                    <div className='flex items-center justify-between mb-[1vw] md:mb-1'>
                                        <div>
                                            {product.discount > 0 ? (
                                                <>
                                                    <span className='font-bold text-smallTextPhone md:text-regularText'>{formatINR(product.discount)}</span>
                                                    <span className='ml-1 text-tinyTextPhone md:text-xs line-through text-gray-400'>{formatINR(product.price)}</span>
                                                </>
                                            ) : (
                                                <span className='font-bold text-smallTextPhone md:text-regularText'>{formatINR(product.price)}</span>
                                            )}
                                        </div>
                                        <span className='text-tinyTextPhone md:text-xs text-gray-400'>
                                            {product.review?.length > 0 ? `${renderStars(product.review.reduce((acc, r) => acc + r.rating, 0) / product.review.length)} ${product.review.length}` : ''}
                                        </span>
                                    </div>
                                    <button className='w-full py-[2vw] md:py-1.5 bg-btngrery rounded-[8vw] md:rounded-full text-smallTextPhone md:text-sm font-medium hover:bg-gray-200 transition-colors'>
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </TransitionLink>
                    );
                })}
            </div>
        </div>
        </div>
    );
};
