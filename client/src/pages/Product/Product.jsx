import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ProductDescription from './productDescription';
import CustomerReview from './CustomerReview';
import { api } from '@/lib/axios';

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
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        api.get(`/api/product/${id}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
        });
    },[id])

    const getCategoryPath = (p) => {
        const cat = p.category?.toLowerCase() || 'eyeglasses';
        const gender = p.gender?.toLowerCase();
        const audience = (!gender || gender === 'everyone') ? 'all' : gender;
        return `/shop/${cat}/${audience}`;
    };

    return (
        product == null ? <Spinner/> :
        <div className='py-[6vw] md:py-[4vw] mx-[5vw] md:mx-[2vw] font-roboto'>
          <div className='mb-[3vw] md:mb-[1vw]'>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className='text-regularTextPhone md:text-regularText cursor-pointer'
                    onClick={() => navigate('/')}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className='text-regularTextPhone md:text-regularText cursor-pointer capitalize'
                    onClick={() => navigate(getCategoryPath(product))}
                  >
                    {product.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-regularTextPhone md:text-regularText font-medium'>
                    {product.modelName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {(product.modelCode || product.modelTitle) && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className='text-regularTextPhone md:text-regularText text-gray-500'>
                        {[product.modelCode, product.modelTitle].filter(Boolean).join(' · ')}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
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
