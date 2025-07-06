import React, { useState, useEffect } from 'react'
import plus from '@/assets/images/checkout/plus.svg';
import close from '@/assets/images/checkout/close.svg';
import edit from '@/assets/images/checkout/edit.svg';
import AddressDialougeBox from '@/components/AddressDialougeBox';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import { loginSuccess } from '@/redux/slice/authSlice';
import { formatINR } from '@/components/IntToPrice';
import { TitleButton2 } from '@/components/button';
// import { toast } from 'react-toastify'; // Uncomment if you want to show toasts

const Step1 = ({ cartItems, setStep, setShippingAddress }) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    console.log(user);
    if(user.addressList.length>0){
      setShippingAddress(user.addressList[0]);
    }
  }, [user]);

  useEffect(() => {
    setTotalPrice(cartItems.reduce((total, item) => total + item.productId.price * item.quantity, 0));
  }, [cartItems]);

  const handleAddressSubmit = async (addressData) => {
    if (!user || !user._id) {
      // toast.error('User not logged in');
      return;
    }
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
    } 
    else {
    try {
      console.log(addressData);
      const response = await axios.post(
        `${baseURL}/api/user/address/add/${user._id}`,
        { address: addressData },
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log(response.data);
        // Refetch user data
        const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: userRes.data.user }));
        // toast.success('Address added successfully!');
        setIsAddressDialogOpen(false);
        // Optionally update address list in UI here
      } else {
        // toast.error(response.data.message || 'Failed to add address');
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Failed to add address');
      console.error('Error adding address:', error);
    }
  }
  };

  const handleRemoveAddress = async (index) => {
    if (!user || !user._id) {
      // toast.error('User not logged in');
      return;
    }
    try {
      const response = await axios.post(`${baseURL}/api/user/address/remove/${user._id}`, { index }, { withCredentials: true });
      if (response.data.success) {
        // Refetch user data
        const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: userRes.data.user }));
        // toast.success('Address removed successfully!');
      } else {
        // toast.error(response.data.message || 'Failed to remove address');
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Failed to remove address');
      console.error('Error removing address:', error);
    }
  }

  const handleEditAddress = async (index) => {
    setIsEditAddress(true);
    setAddressData(user.addressList[index]);
    setIsAddressDialogOpen(true);
  }

  return (
    <div className='flex flex-col gap-[2vw] bg-white p-[2vw] rounded-[1.75vw] mx-[2vw]'>
        <div className='flex flex-row items-center justify-between'>
            <p className='text-h4Text leading-[130%] font-dyeLine font-bold'>Items in Your Cart ({cartItems.length})</p>
            <p className='text-h5Text leading-[130%] font-dyeLine font-bold text-right'>Cart Total: {formatINR(totalPrice)}</p>
        </div>
        <div className='flex flex-row gap-[1.5vw]'>
            <div className='flex flex-col gap-[1.5vw] w-[57.5vw]'>
                <p className='text-h6Text leading-[150%] font-roboto font-bold'>Select Address</p>
                {
                  user.addressList.length>0 && user.addressList.map((address, index) => (
                    <label key={index} className={`text-[#17183B] flex flex-row bg-[#F6F6F6] rounded-[8px] items-center justify-between cursor-pointer border gap-[24px] p-[1.5vw] `} >
                <div className="flex gap-[16px]">
                  <input
                    type="radio"
                    name="selectedAddress"
                    className='w-[1vw] h-[1vw] mt-[10px] accent-black'
                    checked={selectedAddressIndex === index}
                    onChange={() => setSelectedAddressIndex(index)}
                  />
                  <div className='flex flex-col gap-[4px]'>
                  <span className='text-mediumText leading-[150%] font-roboto'>{address.fullName}</span>
                  <span className='text-mediumText leading-[150%] font-roboto line-clamp-2'>{address.flat} {address.area}, {address.city} {address.state}, {address.pincode}</span>
                  <span className='text-mediumText leading-[150%] font-roboto'>{address.mobileNumber}</span>
                  </div>
                </div>
                <button className='ml-auto' onClick={() => handleEditAddress(index)}>
                <img src={edit} alt="edit" className='w-[1.5vw] h-[1.5vw]' /></button>
                <button onClick={() => handleRemoveAddress(index)}>
                <img src={close} alt="close" className='w-[1.5vw] h-[1.5vw]' />
                </button>
              </label>
                  ))
                }
                <div className='flex flex-row w-full items-center'>
                  <div className='border-black border-dashed w-[100%] border-[1px] h-[1px]'  style={{
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,1))',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,1))',
                  }}/>
                                                    <button 
                    className='w-[1.5vw] min-w-[1.5vw] h-[1.5vw] min-h-[1.5vw]'
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <img src={plus} alt="plus" className='w-[1.5vw] h-[1.5vw]' />
                  </button>
                                  <div className='border-black border-dashed w-[100%] border-[1px] h-min'  style={{
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,1))',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,1))',
                  }}/>
                </div>
                <p className='mt-[-1vw] text-smallText leading-[150%] font-roboto font-bold text-center'>Add New Address</p>
            </div>
            <div className='flex flex-col gap-[1.5vw] w-[37.5vw] p-[16px]'>
              <p className='text-h6Text leading-[150%] font-roboto font-bold'>Order Summary</p>
              <div className='flex flex-col gap-[1.5vw]'>
                {cartItems.map((item) => (
                  <div className='flex flex-row gap-[1.5vw] border-[1px] border-[#f5f5f5] rounded-[8px] p-[8px]'>
                    <img src={item.productId.images[0]} alt="item" className='w-[3.125vw] h-[3.375vw]' />
                    <div className='flex flex-col gap-[4px]'>
                    <p className='text-regularText leading-[150%] font-roboto font-bold'>{item.productId.modelTitle}</p>
                    <p className='text-smallText leading-[150%] font-roboto'>{item.productId.brand}</p>
                    </div>
                    <p className='text-smallText leading-[150%] font-bold font-roboto text-right ml-auto'>{item.quantity} x {formatINR(item.productId.price)}</p>
                  </div>
                ))}
              </div>
                    <TitleButton2 
                        className='mt-[1.25vw] mx-auto bg-black w-[100%]' 
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={"Proceed to Payment"}
                        onClick={() => {setStep(2)}}  
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
  )
}

export default Step1
