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
  console.log(location);
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
  // const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  // const [serviceability, setServiceability] = useState(null);
  // const [checkingServiceability, setCheckingServiceability] = useState(false);

  // // Form states
  // const [shippingAddress, setShippingAddress] = useState({
  //   name: user?.name || '',
  //   address: user?.address || '',
  //   city: user?.city || '',
  //   state: user?.state || '',
  //   zipcode: user?.zipcode || '',
  //   phone: user?.number || '',
  //   email: user?.email || ''
  // });

  // const [paymentDetails, setPaymentDetails] = useState({
  //   method: 'COD',
  //   status: 'Pending'
  // });

  // const [orderSummary, setOrderSummary] = useState({
  //   subtotal: 0,
  //   tax: 0,
  //   deliveryCharges: 0,
  //   discount: 0,
  //   total: 0
  // });

  // useEffect(() => {
  //   fetchCartItems();
  // }, []);

  // const fetchCartItems = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/api/user/cart/${user._id}`, {
  //       withCredentials: true
  //     });
      
  //     if (response.data.success) {
  //       setCartItems(response.data.cart);
  //       calculateOrderSummary(response.data.cart);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching cart items:', error);
  //     toast.error('Failed to load cart items');
  //   }
  // };

  // const calculateOrderSummary = (items) => {
  //   const subtotal = items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
  //   const tax = subtotal * 0.18; // 18% GST
  //   const deliveryCharges = 0; // Will be calculated based on serviceability
  //   const discount = 0; // Can be added later
  //   const total = subtotal + tax + deliveryCharges - discount;

  //   setOrderSummary({
  //     subtotal,
  //     tax,
  //     deliveryCharges,
  //     discount,
  //     total
  //   });
  // };

  // const checkServiceability = async () => {
  //   if (!shippingAddress.zipcode) {
  //     toast.error('Please enter delivery pincode');
  //     return;
  //   }

  //   setCheckingServiceability(true);
  //   try {
  //     const response = await axios.get(`${baseURL}/api/order/serviceability`, {
  //       params: {
  //         pickupPincode: '110001', // Your store pincode
  //         deliveryPincode: shippingAddress.zipcode,
  //         weight: 0.5
  //       }
  //     });

  //     if (response.data.success) {
  //       setServiceability(response.data.serviceability);
  //       // Update delivery charges based on available couriers
  //       if (response.data.serviceability.data && response.data.serviceability.data.length > 0) {
  //         const cheapestCourier = response.data.serviceability.data[0];
  //         setOrderSummary(prev => ({
  //           ...prev,
  //           deliveryCharges: cheapestCourier.rate,
  //           total: prev.subtotal + prev.tax + cheapestCourier.rate - prev.discount
  //         }));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Serviceability check error:', error);
  //     toast.error('Failed to check delivery availability');
  //   } finally {
  //     setCheckingServiceability(false);
  //   }
  // };

  // const handleAddressChange = (field, value) => {
  //   setShippingAddress(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  // const handlePaymentMethodChange = (method) => {
  //   setPaymentDetails(prev => ({
  //     ...prev,
  //     method
  //   }));
  // };

  // const validateForm = () => {
  //   const requiredFields = ['name', 'address', 'city', 'state', 'zipcode', 'phone', 'email'];
  //   for (const field of requiredFields) {
  //     if (!shippingAddress[field]) {
  //       toast.error(`Please fill in ${field}`);
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // const placeOrder = async () => {
  //   if (!validateForm()) return;
  //   if (!serviceability) {
  //     toast.error('Please check delivery availability first');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const orderData = {
  //       products: cartItems.map(item => ({
  //         productId: item.productId._id,
  //         quantity: item.quantity,
  //         price: item.productId.price
  //       })),
  //       shippingAddress,
  //       paymentDetails,
  //       deliveryCharges: orderSummary.deliveryCharges,
  //       notes: ''
  //     };

  //     const response = await axios.post(`${baseURL}/api/order/create`, orderData, {
  //       withCredentials: true
  //     });

  //     if (response.data.success) {
  //       toast.success('Order placed successfully!');
  //       navigate(`/order/${response.data.order._id}`);
  //     }
  //   } catch (error) {
  //     console.error('Place order error:', error);
  //     toast.error(error.response?.data?.message || 'Failed to place order');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  console.log(step);
  return (
    <div className="min-h-screen ">
      <div className='py-[4.5vw] px-[10vw] flex flex-row max-w-[1440px] mx-auto items-center'>
        <div className={`flex flex-row gap-[.5vw] items-center px-[5vw] transition-all duration-500 ${step===1 ? "opacity-100" : "opacity-20"}`}>
          <img src={locationIcon} className='w-[1.5vw] h-[1.5vw]'/>
          <div className='flex flex-col '>
            <p className='text-smallText leading-[103%]'>Step 1</p>
            <p className='text-mediumText leading-[103%]'>Address</p>
          </div>
        </div>
        <div
  className="w-full h-[1px] border-[1px] border-dashed border-black"
  style={{
    maskImage:
      'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 100%)',
    WebkitMaskImage:
      'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.2) 100%)',
  }}
></div>
        <div className={`flex flex-row gap-[.5vw] items-center px-[5vw] transition-all duration-500 ${step===2 ? "opacity-100" : "opacity-20"}`}>
          <img src={payment} className='w-[1.5vw] h-[1.5vw]'/>
          <div className='flex flex-col '>
            <p className='text-smallText leading-[103%]'>Step 2</p>
            <p className='text-mediumText leading-[103%]'>Payment</p>
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