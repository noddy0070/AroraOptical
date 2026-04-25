import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';
import { TitleButton } from '@/components/button';
import locationIcon from '@/assets/images/checkout/location.svg';
import payment from '@/assets/images/checkout/payment.svg';
import Step1 from './Step1';
import Step2 from './Step2';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");

  const goToStep = (newStep) => {
    setDirection(newStep > step ? "forward" : "backward");
    setStep(newStep);
  };
  const location = useLocation();
  const cartItems = location.state?.data || [];
  const [shippingAddress,setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    email: '',
  })
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  
  return (
    <div className="min-h-screen ">
      <div className='py-[6vw] md:py-[4.5vw] px-[5vw] md:px-[10vw] flex flex-row max-w-[1440px] mx-auto items-center'>
        <div className={`flex flex-row gap-[2vw] md:gap-[.5vw] items-center px-[3vw] md:px-[5vw] transition-all duration-500 ${step===1 ? "opacity-100" : "opacity-20"}`}>
          <img src={locationIcon} className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw]'/>
          <div className='flex flex-col'>
            <p className='text-smallTextPhone md:text-smallText leading-[103%]'>Step 1</p>
            <p className='text-mediumTextPhone md:text-mediumText leading-[103%]'>Address</p>
          </div>
        </div>
        <div
  className="w-full h-[1px] border-[1px] border-dashed border-black hidden md:block"
  style={{
    maskImage:
      'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 100%)',
    WebkitMaskImage:
      'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 100%)',
  }}
></div>
        <div className={`flex flex-row gap-[2vw] md:gap-[.5vw] items-center px-[3vw] md:px-[5vw] transition-all duration-500 ${step===2 ? "opacity-100" : "opacity-20"}`}>
          <img src={payment} className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw]'/>
          <div className='flex flex-col'>
            <p className='text-smallTextPhone md:text-smallText leading-[103%]'>Step 2</p>
            <p className='text-mediumTextPhone md:text-mediumText leading-[103%]'>Payment</p>
          </div>
        </div>

      </div>
      <AnimatePresence mode="wait">
  {step === 1 && (
    <motion.div
      key="step1"
      initial={{ x: direction === "forward" ? "-100vw" : "0vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? "-100vw" : "0vw", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Step1 cartItems={cartItems} setStep={goToStep} setShippingAddress={setShippingAddress} setDeliveryPrice={setDeliveryPrice} />
    </motion.div>
  )}

  {step === 2 && (
    <motion.div
      key="step2"
      initial={{ x: direction === "forward" ? "100vw" : "0vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === "forward" ? "100vw" : "0vw", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
        <Step2 cartItems={cartItems} setStep={goToStep} shippingAddress={shippingAddress} deliveryPrice={deliveryPrice} />
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default Checkout; 