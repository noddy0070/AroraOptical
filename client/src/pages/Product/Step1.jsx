import React, { useState, useEffect, useCallback } from 'react'
import plus from '@/assets/images/checkout/plus.svg';
import close from '@/assets/images/checkout/close.svg';
import edit from '@/assets/images/checkout/edit.svg';
import AddressDialougeBox from '@/components/AddressDialougeBox';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import { toTitleCase } from '../../../shared/pipes/strFormatting';
import { loginSuccess } from '@/redux/slice/authSlice';
import { formatINR } from '@/components/IntToPrice';
import { TitleButton2 } from '@/components/button';

const Step1 = ({ cartItems, setStep, setShippingAddress, setDeliveryPrice }) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // delivery state
  const [deliveryStatus, setDeliveryStatus] = useState(null); // null | 'loading' | 'available' | 'unavailable'
  const [deliveryRate, setDeliveryRate] = useState(null);

  useEffect(() => {
    if (user.addressList.length > 0) {
      setShippingAddress(user.addressList[0]);
    }
  }, [user]);

  useEffect(() => {
    setTotalPrice(cartItems.reduce((total, item) => total + item.totalAmount * item.quantity, 0));
  }, [cartItems]);

  const checkDeliverability = useCallback(async (address) => {
    if (!address?.pincode) return;
    setDeliveryStatus('loading');
    setDeliveryRate(null);
    setDeliveryPrice(null);
    try {
      const pickupPincode = '462023';
      const deliveryPincode = address.pincode;
      const weight = 0.5 * cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      const declaredValue = cartItems.reduce((acc, item) => acc + (item.totalAmount * item.quantity), 0);
      const response = await axios.get(`${baseURL}/api/order/serviceability`, {
        params: { pickupPincode, deliveryPincode, weight, cod: 1, declaredValue },
      });
      const couriers = response.data.serviceability?.data?.available_courier_companies || [];
      if (response.data.success && couriers.length > 0) {
        const sorted = [...couriers].sort((a, b) => a.rate - b.rate);
        const cheapest = sorted[0];
        console.log('[Delivery] All couriers (sorted by rate):',
          sorted.map(c => ({ name: c.courier_name, rate: c.rate, eta: c.estimated_delivery_days, id: c.courier_company_id }))
        );
        console.log('[Delivery] Selected:', { name: cheapest.courier_name, rate: cheapest.rate, eta: cheapest.estimated_delivery_days });
        setDeliveryStatus('available');
        setDeliveryRate(cheapest.rate);
        setDeliveryPrice(cheapest.rate);
      } else {
        setDeliveryStatus('unavailable');
      }
    } catch (error) {
      setDeliveryStatus('unavailable');
      console.error('Deliverability check failed:', error);
    }
  }, [cartItems, setDeliveryPrice]);

  // Auto-check when selected address changes
  useEffect(() => {
    if (user.addressList.length > 0 && user.addressList[selectedAddressIndex]) {
      checkDeliverability(user.addressList[selectedAddressIndex]);
    }
  }, [selectedAddressIndex, user.addressList]);

  const handleAddressSubmit = async (addressData) => {
    if (!user || !user._id) return;
    if (isEditAddress) {
      try {
        const response = await axios.post(`${baseURL}/api/user/address/edit/${user._id}`, { index: selectedAddressIndex, address: addressData }, { withCredentials: true });
        if (response.data.success) {
          const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
          dispatch(loginSuccess({ user: userRes.data.user }));
          setIsAddressDialogOpen(false);
        }
      } catch (error) {
        console.error('Error editing address:', error);
      }
    } else {
      try {
        const response = await axios.post(`${baseURL}/api/user/address/add/${user._id}`, { address: addressData }, { withCredentials: true });
        if (response.data.success) {
          const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
          dispatch(loginSuccess({ user: userRes.data.user }));
          setIsAddressDialogOpen(false);
        }
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  };

  const handleRemoveAddress = async (index) => {
    if (!user || !user._id) return;
    try {
      const response = await axios.post(`${baseURL}/api/user/address/remove/${user._id}`, { index }, { withCredentials: true });
      if (response.data.success) {
        const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: userRes.data.user }));
      }
    } catch (error) {
      console.error('Error removing address:', error);
    }
  };

  const handleEditAddress = (index) => {
    setIsEditAddress(true);
    setAddressData(user.addressList[index]);
    setIsAddressDialogOpen(true);
  };

  const canProceed = deliveryStatus === 'available';
  const estimatedTotal = canProceed ? totalPrice + deliveryRate : totalPrice;

  return (
    <div className='flex flex-col gap-[6vw] md:gap-[2vw] bg-white p-[5vw] md:p-[2vw] rounded-[7vw] md:rounded-[1.75vw] mx-[5vw] md:mx-[2vw]'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-[3vw] md:gap-0'>
        <p className='text-h4TextPhone md:text-h4Text leading-[130%] font-dyeLine font-bold'>Items in Your Cart ({cartItems.length})</p>
        <p className='text-h5TextPhone md:text-h5Text leading-[130%] font-dyeLine font-bold text-left md:text-right'>Cart Total: {formatINR(totalPrice)}</p>
      </div>

      <div className='flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw]'>
        {/* Address list */}
        <div className='flex flex-col gap-[4vw] md:gap-[1.5vw] w-full md:w-[57.5vw]'>
          <p className='text-h6TextPhone md:text-h6Text leading-[150%] font-roboto font-bold'>Select Delivery Address</p>

          {user.addressList.map((address, index) => {
            const isSelected = selectedAddressIndex === index;
            return (
              <label
                key={index}
                className={`flex flex-row bg-[#F6F6F6] rounded-[2vw] md:rounded-[8px] items-start justify-between cursor-pointer border gap-[6vw] md:gap-[24px] p-[4vw] md:p-[1.5vw] transition-all duration-200 ${isSelected ? 'border-black' : 'border-transparent'}`}
              >
                <div className='flex gap-[4vw] md:gap-[16px] flex-1 min-w-0'>
                  <input
                    type='radio'
                    name='selectedAddress'
                    className='w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] mt-[2.5vw] md:mt-[4px] accent-black shrink-0'
                    checked={isSelected}
                    onChange={() => {
                      setSelectedAddressIndex(index);
                      setShippingAddress(user.addressList[index]);
                    }}
                  />
                  <div className='flex flex-col gap-[1vw] md:gap-[4px] flex-1 min-w-0'>
                    <span className='text-mediumTextPhone md:text-mediumText leading-[150%] font-roboto font-semibold'>{toTitleCase(address.fullName)}</span>
                    <span className='text-mediumTextPhone md:text-mediumText leading-[150%] font-roboto text-gray-600 line-clamp-2'>{address.flat} {address.area}, {address.city} {address.state} – {address.pincode}</span>
                    <span className='text-mediumTextPhone md:text-mediumText leading-[150%] font-roboto text-gray-600'>{address.mobileNumber}</span>

                    {/* Inline delivery status — only on selected card */}
                    {isSelected && (
                      <div className='mt-[1vw] md:mt-[6px]'>
                        {deliveryStatus === 'loading' && (
                          <span className='flex items-center gap-[1.5vw] md:gap-[6px] text-smallTextPhone md:text-smallText text-gray-400'>
                            <svg className='animate-spin w-[3vw] md:w-[12px] h-[3vw] md:h-[12px] shrink-0' viewBox='0 0 24 24' fill='none'>
                              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'/>
                            </svg>
                            Checking delivery availability…
                          </span>
                        )}
                        {deliveryStatus === 'available' && (
                          <span className='flex items-center gap-[1.5vw] md:gap-[6px] text-smallTextPhone md:text-smallText text-green-600 font-medium'>
                            <svg className='w-[3vw] md:w-[13px] h-[3vw] md:h-[13px] shrink-0' viewBox='0 0 20 20' fill='currentColor'>
                              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'/>
                            </svg>
                            Delivery available · {formatINR(deliveryRate)}
                          </span>
                        )}
                        {deliveryStatus === 'unavailable' && (
                          <span className='flex items-center gap-[1.5vw] md:gap-[6px] text-smallTextPhone md:text-smallText text-red-500 font-medium'>
                            <svg className='w-[3vw] md:w-[13px] h-[3vw] md:h-[13px] shrink-0' viewBox='0 0 20 20' fill='currentColor'>
                              <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd'/>
                            </svg>
                            Delivery not available to this pincode
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex flex-row gap-[2vw] md:gap-[8px] shrink-0'>
                  <button onClick={(e) => { e.preventDefault(); handleEditAddress(index); }}>
                    <img src={edit} alt='edit' className='w-[6vw] md:w-[1.25vw] h-[6vw] md:h-[1.25vw]' />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); handleRemoveAddress(index); }}>
                    <img src={close} alt='remove' className='w-[6vw] md:w-[1.25vw] h-[6vw] md:h-[1.25vw]' />
                  </button>
                </div>
              </label>
            );
          })}

          {/* Add new address */}
          <div className='flex flex-row w-full items-center'>
            <div className='border-black border-dashed w-full border-[1px] h-[1px]' style={{ maskImage: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,1))', WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,1))' }} />
            <button className='w-[6vw] md:w-[1.5vw] min-w-[6vw] md:min-w-[1.5vw] h-[6vw] md:h-[1.5vw]' onClick={() => { setIsEditAddress(false); setIsAddressDialogOpen(true); }}>
              <img src={plus} alt='add' className='w-[6vw] md:w-[1.5vw] h-[6vw] md:h-[1.5vw]' />
            </button>
            <div className='border-black border-dashed w-full border-[1px] h-[1px]' style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,1))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,1))' }} />
          </div>
          <p className='mt-[-2vw] md:mt-[-1vw] text-smallTextPhone md:text-smallText leading-[150%] font-roboto font-bold text-center'>Add New Address</p>
        </div>

        {/* Order summary */}
        <div className='flex flex-col gap-[4vw] md:gap-[1.5vw] w-full md:w-[37.5vw] p-[4vw] md:p-[16px]'>
          <p className='text-h6TextPhone md:text-h6Text leading-[150%] font-roboto font-bold'>Order Summary</p>

          <div className='flex flex-col gap-[4vw] md:gap-[1.5vw]'>
            {cartItems.map((item) => (
              <div key={item.productId._id} className='flex flex-row gap-[3vw] md:gap-[1.5vw] border-[1px] border-[#f5f5f5] rounded-[2vw] md:rounded-[8px] p-[2vw] md:p-[8px]'>
                <img src={item.productId.images[0]} alt='item' className='w-[25vw] md:w-[3.125vw] h-[25vw] md:h-[3.375vw] object-cover rounded-[2vw] md:rounded-none' />
                <div className='flex flex-col gap-[1vw] md:gap-[4px] flex-1'>
                  <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold'>{item.productId.modelTitle}</p>
                  <p className='text-smallTextPhone md:text-smallText leading-[150%] font-roboto text-gray-500'>{item.productId.brand}</p>
                </div>
                <p className='text-smallTextPhone md:text-smallText leading-[150%] font-bold font-roboto text-right ml-auto whitespace-nowrap'>{item.quantity} × {formatINR(item.totalAmount)}</p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className='flex flex-col gap-[2vw] md:gap-[8px] border-t border-gray-100 pt-[3vw] md:pt-[12px]'>
            <div className='flex flex-row justify-between'>
              <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto text-gray-500'>Items total</p>
              <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>{formatINR(totalPrice)}</p>
            </div>
            <div className='flex flex-row justify-between items-center'>
              <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto text-gray-500'>Delivery charges</p>
              {deliveryStatus === 'loading' && (
                <span className='text-smallTextPhone md:text-smallText text-gray-400 italic'>Calculating…</span>
              )}
              {deliveryStatus === 'available' && (
                <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>{formatINR(deliveryRate)}</p>
              )}
              {(deliveryStatus === 'unavailable' || deliveryStatus === null) && (
                <span className='text-smallTextPhone md:text-smallText text-gray-400'>—</span>
              )}
            </div>
            <div className='w-full h-[1px] border-dashed border-gray-300 border-[1px]' />
            <div className='flex flex-row justify-between'>
              <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold'>Estimated Total</p>
              <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold'>{formatINR(estimatedTotal)}</p>
            </div>
          </div>

          <TitleButton2
            disabled={!canProceed}
            className='mt-[5vw] md:mt-[1.25vw] mx-auto bg-black w-full md:w-[100%]'
            btnHeightPhone={12}
            btnWidthPhone={100}
            btnRadiusPhone={12}
            btnHeight={3}
            btnWidth={30}
            btnRadius={2}
            btnTitle={deliveryStatus === 'loading' ? 'Checking delivery…' : deliveryStatus === 'unavailable' ? 'Delivery not available' : 'Proceed to Payment'}
            onClick={() => {
              setShippingAddress(user.addressList[selectedAddressIndex]);
              setStep(2);
            }}
          />
        </div>
      </div>

      <AddressDialougeBox
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onSubmit={handleAddressSubmit}
        handleAddressSubmit={handleAddressSubmit}
        isEditAddress={isEditAddress}
        addressData={addressData}
      />
    </div>
  );
};

export default Step1;
