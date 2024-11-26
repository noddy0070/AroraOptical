import React,{useState,useRef} from 'react';
import placeholder from "../../assets/images/CategoryPlaceholder.png";
import categoryPlaceholder from '../../assets/images/categoryPlaceholder.png';
import './product.css';
import { IconButton } from '../../components/button';
const product={
    name: 'Product Name',
    model: 'Model Name',
    price: 'Price',
    rating: 3.5,
    noOfReviews: 100,
    productDescription:"Product Description- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    sizes: ['S','M','L','XL'],
    variants: ['Option One','Option Two','Option Three','Option Four'],
    productDetail:"Product Details- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    productSpecifications:["Specification1","Specification2","Specification3","Specification4"],
}

const buyingOptions=[
    {
        img:categoryPlaceholder,
        title:'Non Prescriptive',
        description:'Fashion-forward frames with clear lenses—no prescription needed.',
    },
    {
        img:categoryPlaceholder,
        title:'Single Vision',
        description:'Perfect for clear vision at one distance—ideal for reading or distance.',
    },
    {
        img:categoryPlaceholder,
        title:'Varifocal',
        description:'Seamless transition between near and far vision in one lens.',
    }
]

const lensOptions=[
    {
        img:categoryPlaceholder,
        title:'Clear',
        description:'Classic, crystal-clear lenses for everyday use—offering sharp, undistorted vision.',
    },
    {
        img:categoryPlaceholder,
        title:'Blue Lenses',
        description:'Protect your eyes from digital strain with lenses designed to filter blue light.',
    },
    {
        img:categoryPlaceholder,
        title:'Light Adative',
        description:'Versatile lenses that adjust to changing light—darken in sunlight and  clear indoors',
    }
]


const productImg={
    imgMain:placeholder,
    img:[placeholder,placeholder,placeholder,placeholder,placeholder,placeholder,placeholder]
}

export default function ProductDescription(){
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const quantityInputRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDetailClicked, setIsDetailClicked] = useState(true);
    const [isShipingClicked, setIsShipingClicked] = useState(true);
    const [isReturnClicked, setIsReturnClicked] = useState(true);

    const handleSizeChange = (event) => {
      setSelectedSize(event.target.value);
    };

    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
      };

      const handleQuantityChange = () => {
        const value = quantityInputRef.current.value;
        setSelectedQuantity(value); 
      };
    return (
        <div className='font-roboto text-regularText flex  flex-row lg:px-[2vw] gap-[1.5vw]'>

            {/* Product Images */}
            <div className='flex flex-col w-[53.6875vw] gap-[1.5vw]'> 
            <div className='flex flex-row h-[47.75vw]  w-full gap-[1.125vw]'>
                <div className='flex flex-col h-[46.75vw] overflow-y-auto gap-[1.125vw] hide-scrollbar'>
                    {productImg.img.map((img,index)=>(
                            <img key={index} className='h-[7vw] w-[6.875vw] rounded-[0.625vw]' src={img}></img>
                    ))}
                    
                </div>
                <img className='h-full w-[45.6875vw] rounded-[1.375vw]' src={productImg.imgMain}></img>
                
                </div>

            <div className='w-full flex flex-col gap-[1vw]'>
                <div>
                <p className='font-bold text-mediumText text-center mt-[1.5vw]'> Buying Options</p>
                <p className='text-smallText text-center'>Available at Checkout*</p>
                </div>

                <div className='flex flex-row w-full gap-[1.5vw]'>
                {buyingOptions.map((option,index)=>(
                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                    <img className='w-full h-full' src={option.img}/>
                    <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                    <div className='absolute h-[7.5vw]    bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                        <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                            {option.title}
                        </h6>
                        <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                            {option.description}
                        </span>

                    </div>
                </div>
                ))}
                
                </div>
                
            </div>

            <div className='w-full flex flex-col gap-[1vw]'>
                <div>
                <p className='font-bold text-mediumText text-center mt-[1.5vw]'> Lens Options</p>
                <p className='text-smallText text-center'>Available at Checkout*</p>
                </div>

                <div className='flex flex-row w-full gap-[1.5vw]'>
                {lensOptions.map((option,index)=>(
                    <div className='relative w-[16.125vw] h-[18.75vw] rounded-[1.1vw] overflow-hidden'>
                    <img className='w-full h-full' src={option.img}/>
                    <IconButton btnSize={1.825} iconWidth={1.825} padding={0.45} className='absolute right-[.75vw] top-[.75vw]'/>
                    <div className='absolute h-[7.5vw]    bottom-[.75vw] left-[.75vw] w-[15.125vw]'>
                        <h6 className='mb-[1vw] leading-[120%] font-dyeLine font-bold text-h6Text'>
                            {option.title}
                        </h6>
                        <span className='hidden lg:block leading-[150%] font-roboto text-regularText'>
                            {option.description}
                        </span>

                    </div>
                </div>
                ))}
                
                </div>
                
            </div>
            </div>

            {/* Product Description */}
            <div className=' w-[41.8125vw] lg:w-[37.8125vw]'>
            <div className='flex flex-col gap-[1.5vw] w-[41.8125vw] lg:w-[37.8125vw] '>
                {/* Product Details block */}
                <div>
                    <h3 className='  font-bold text-h3Text leading-[120%]  ' >{product.name}</h3>
                    <span className='leading-[150%]'>{product.model}</span>
                    <h5 className='text-h5Text font-bold leading-[140%]'>{product.price}</h5>
                </div>
                
                {/* Rating block */}
                <span>{product.rating} " * " {product.noOfReviews}</span>
                <p className='leading-[150%]'>{product.productDescription}</p>
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
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" fill="black"/>
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
                <div className='flex flex-col gap-[.5vw]'>
                        <span>Variant</span>
                        <div className='flex flex-row gap-[.5vw] overflow-x-auto'>
                            {product.variants.map((variant,index)=>(
                                <button key={index} className={`whitespace-nowrap border-[1px] border-black w-auto py-[.75vw] px-[1.5vw] rounded-[2vw] ${
                                  selectedVariant === variant ? 'bg-black text-white' : 'bg-white text-black' }`}
                                onClick={() => handleVariantClick(variant)} > {variant}</button>
                            ))}
                        </div>
                </div>

                {/* Quantity block */}
                <div className='flex flex-col gap-[.5vw]'>
                    <span>Quantity</span>
                    <input type="number" ref={quantityInputRef}  onChange={handleQuantityChange}  value={selectedQuantity} className=' p-[.75vw] border-[1px] w-[4vw] border-black focus:outline-none'></input>
                </div>
                {/* Buy and add to cart button */}
                <div className='flex flex-row gap-[1vw]'>
                     <button className='w-[16vw] rounded-[3.5vw] h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] text-white bg-darkslategrey'>Buy Now</button>
                     <button className='w-[16vw] rounded-[3.5vw] h-[4.25vw] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] bg-btngrery'>Add to cart </button>
                </div>
                {/* Notice  */}
                <p className='text-center text-smallText'>Free shipping over Rs. 999</p>
            </div>
            <div className='border-y-[1px] border-black'>
                <div className='py-[1vw] flex flex-row items-center ' onClick={()=>setIsDetailClicked(!isDetailClicked)}>
                            <p className='text-mediumText font-bold'>Details</p>
                            <div className="ml-auto cursor-pointer  rotate-180  transform transition-transform duration-300 " style={{ transform:isDetailClicked? 'rotate(180deg)':'rotate(0deg)' }}  >
                            <svg width=".8125vw" height=".5vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" fill="black"/>
                            </svg>

                            </div>
                </div>
                <div className={`${isDetailClicked==true?"content show":"content "}`}>
                <p className='text-regularText  leading-[150%]'>
                    {product.productDetail}
                    <br/>
                    <br/>
                </p>
                <p className='text-mediumText  font-semibold leading-[150%]'>Product Specification</p>
                <ul className='text-regularText list-roman-left leading-[150%] pb-[1vw]'>
                    {product.productSpecifications.map((specification,index)=>(
                        <li key={index} className='text-regularText leading-[150%]'>{specification}</li>
                    ))}
                </ul>
                </div>
            </div>

            <div className='border-b-[1px] border-black'>
                <div className='py-[1vw] flex flex-row items-center ' onClick={()=>setIsShipingClicked(!isShipingClicked)}>
                            <p className='text-mediumText font-bold'>Shipping</p>
                            <div className="ml-auto cursor-pointer  rotate-180  transform transition-transform duration-300 " style={{ transform:isShipingClicked? 'rotate(180deg)':'rotate(0deg)' }}  >
                            <svg width=".8125vw" height=".5vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" fill="black"/>
                            </svg>

                            </div>
                </div>
                <div className={`${isShipingClicked==true?"content show":"content "}`}>
                <p className='text-regularText  leading-[150%]'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum 
                    <br/>
                    <br/>
                </p>
                
                </div>
            </div>

            <div className='border-b-[1px] border-black'>
                <div className='py-[1vw] flex flex-row items-center ' onClick={()=>setIsReturnClicked(!isReturnClicked)}>
                            <p className='text-mediumText font-bold'>Returns</p>
                            <div className="ml-auto cursor-pointer  rotate-180  transform transition-transform duration-300 " style={{ transform:isReturnClicked? 'rotate(180deg)':'rotate(0deg)' }}  >
                            <svg width=".8125vw" height=".5vw" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.39819 7.20296C7.17851 7.42263 6.82241 7.42263 6.60274 7.20296L0.867876 1.46808C0.648208 1.24841 0.648208 0.892307 0.867876 0.672632L1.13305 0.407432C1.35271 0.187757 1.70887 0.187757 1.92854 0.407432L7.00046 5.47938L12.0724 0.407432C12.2921 0.187757 12.6482 0.187757 12.8679 0.407432L13.1331 0.672632C13.3527 0.892307 13.3527 1.24841 13.1331 1.46808L7.39819 7.20296Z" fill="black"/>
                            </svg>

                            </div>
                </div>
                <div className={`${isReturnClicked==true?"content show":"content "}`}>
                <p className='text-regularText  leading-[150%]'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum 
                    <br/>
                    <br/>
                </p>
                </div>
            </div>
            </div>
        </div>

    );
};
