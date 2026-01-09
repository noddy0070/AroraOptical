import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ProductDescription from './productDescription';
import CustomerReview from './CustomerReview';
import axios from 'axios';
import { baseURL } from '@/url';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Product(){
    const { id } = useParams();
    const [product,setProduct]=useState(null);
    useEffect(()=>{
        axios.get(`${baseURL}/api/admin/get-single-product/${id}`)
        .then((res) => {
          setProduct(res.data);
            })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
        });
    },[id])

    return (
        
        product==null?<Spinner/>:
        <div className='py-[6vw] md:py-[4vw] mx-[5vw] md:mx-[2vw] font-roboto'>
          <div className='mb-[3vw] md:mb-[1vw]'>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className='text-regularTextPhone md:text-regularText'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
               
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-regularTextPhone md:text-regularText'>{product.modelTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
            <ProductDescription productToDisplay={product}/>
            {/* <CustomerReview/> */}
        </div>
    );
}


const Spinner = () => {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };
  
  