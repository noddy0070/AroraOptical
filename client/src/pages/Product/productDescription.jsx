import React from 'react';
import placeholder from "../../assets/images/CategoryPlaceholder.png";

const product={
    name: 'Product Name',
    model: 'Model Name',
    price: 'Price',
    rating: 3.5,
    noOfReviews: 100,
    productDescription:"Product Description",
    sizes: ['S','M','L','XL'],
    variants: ['Color1','Color2','Color3','Color4'],
    productDetail:"Product Detail",
    productSpecifications:["Specification1","Specification2","Specification3","Specification4"],

}

export default function ProductDescription(){
    return (
        <div className='font-roboto flex  flex-row px-[2vw] gap-[1.5vw]'>
            <div className='flex flex-col w-[53.6875vw] gap-[1.5vw]'> 
            <div className='flex flex-row h-[47.75vw] w-full gap-[1.125vw]'>
                <div className='flex flex-col gap-[1.125vw]'>
                    <img className='h-[7vw] w-[6.875vw] rounded-[0.625vw]' src={placeholder}/>
                    <img className='h-[7vw] w-[6.875vw] rounded-[0.625vw]' src={placeholder}/>
                    <img className='h-[7vw] w-[6.875vw] rounded-[0.625vw]' src={placeholder}/>
                    <img className='h-[7vw] w-[6.875vw] rounded-[0.625vw]' src={placeholder}/>
                </div>
                <img className='h-full w-[45.6875vw] rounded-[1.375vw]' src={placeholder}></img>
                
                </div>
            </div>
            <div className='flex flex-col gap-[1.5vw] w-[37.8125vw] bg-blue-50'>
                <div>
                    <h2 className='  font-bold text-[2.5rem] leading-[120%]  ' >{product.name}</h2>
                    <span className='text-[1rem leading-[150%]'>{product.model}</span>
                    <h6 className='text-[1.5rem] font-bold leading-[140%]'>{product.price}</h6>
                </div>
                <span>{product.rating} " * " {product.noOfReviews}</span>
                <p className='text-[1rem] leading-[150%]'>{product.productDescription}</p>
                <div>
                    
                </div>
                </div>

        </div>
    );
};
