import React, { useState } from 'react'
import { TitleButton2 } from '@/components/button';
import { formatINR } from '@/components/IntToPrice';
import axios from 'axios';
import { baseURL, razorpayKey, razorpaySecret } from '@/url';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Step2 = ({ cartItems, setStep, shippingAddress, deliveryPrice }) => {
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(shippingAddress);

    // Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0) + deliveryPrice;

    // Razorpay handler
    const handleRazorpayPayment = async () => {
      setLoading(true);
      try {
        // 1. Create Razorpay order from backend
        const { data } = await axios.post(`${baseURL}/api/order/razorpay-order`, {
          amount: totalAmount,
        }, { withCredentials: true });
        if (!data.success) throw new Error('Failed to create Razorpay order');
        const razorpayOrder = data.order;

        // 2. Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          const options = {
            key: razorpayKey,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'Arora Optical',
            description: 'Order Payment',
            order_id: razorpayOrder.id,
            handler: async function (response) {
              // 3. Verify payment on backend
              try {
                const verifyRes = await axios.post(`${baseURL}/api/order/verify-razorpay`, {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: totalAmount,
                  cartItems,
                  shippingAddress,
                }, { withCredentials: true });
                if (verifyRes.data.success) {
                  toast.success('Payment successful! Order placed.');
                  navigate('/thank-you');
                } else {
                  toast.error('Payment verification failed.');
                }
              } catch (err) {
                toast.error('Payment verification failed.');
              }
            },
            prefill: {},
            theme: { color: '#17183B' },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
      } catch (err) {
        toast.error('Payment initiation failed.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className='mx-[5vw] px-[12vw] py-[1.875vw] bg-[#FAFAFA] flex flex-row gap-[2vw]'>
      <div className='flex flex-col gap-[1vw] text-[#17183B] w-[31vw] p-[16px]'>
        <p className='text-mediumText leading-[150%] text-black font-roboto font-bold'>Payment Method</p>
        <label className='flex flex-row gap-[16px] items-center'>
            <input type="radio" name="paymentMethod" id="paymentMethod" className='w-[1vw] h-[1vw] accent-black' checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
            <p className='text-regularText leading-[150%] font-roboto'>UPI</p>
        </label>
        <label className='flex flex-row gap-[16px] items-center'>
            <input type="radio" name="paymentMethod" id="paymentMethod" className='w-[1vw] h-[1vw] accent-black' checked={paymentMethod === "credit/debit card"} onChange={() => setPaymentMethod("credit/debit card")} />
            <p className='text-regularText leading-[150%] font-roboto'>Credit/Debit Card</p>
        </label>
        <label className='flex flex-row gap-[16px] items-center'>
            <input type="radio" name="paymentMethod" id="paymentMethod" className='w-[1vw] h-[1vw] accent-black' checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
            <p className='text-regularText leading-[150%] font-roboto'>Net Banking</p>
        </label>
        <label className='flex flex-row gap-[16px] items-center'>
            <input type="radio" name="paymentMethod" id="paymentMethod" className='w-[1vw] h-[1vw] accent-black' checked={paymentMethod === "cash on delivery"} onChange={() => setPaymentMethod("cash on delivery")} />
            <p className='text-regularText leading-[150%] font-roboto'>Cash on Delivery</p>
        </label>
      </div>

      <div className='flex flex-col gap-[1.5vw] w-[37.5vw] p-[16px]'>
              <p className='text-h6Text leading-[150%] font-roboto font-bold'>Order Summary</p>
              <div className='flex flex-col gap-[1.5vw] w-full'>
                {cartItems.map((item) => (
                  <div key={item.productId._id} className='flex flex-row gap-[1.5vw] border-[1px] border-[#f5f5f5] rounded-[8px] p-[8px]'>
                    <img src={item.productId.images[0]} alt="item" className='w-[3.125vw] h-[3.375vw]' />
                    <div className='flex flex-col gap-[4px]'>
                    <p className='text-regularText leading-[150%] font-roboto font-bold'>{item.productId.modelTitle}</p>
                    <p className='text-smallText leading-[150%] font-roboto'>{item.productId.brand}</p>
                    </div>
                    <p className='text-smallText leading-[150%] font-bold font-roboto text-right ml-auto'>{item.quantity} x {formatINR(item.productId.price)}</p>
                  </div>
                ))}
                <p className='text-regularText leading-[150%] font-roboto font-bold'>Total Payable</p>
                <div className='flex flex-row'>
                  <p className='text-regularText leading-[150%] font-roboto'>MRP(Incl. Tax)</p>
                  <p className='text-regularText ml-auto text-right leading-[150%] font-roboto'>{formatINR(cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0))}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='text-regularText leading-[150%] font-roboto'>Delivery Charges</p>
                  <p className='text-regularText ml-auto text-right leading-[150%] font-roboto'>{formatINR(deliveryPrice)}</p>
                </div>
                <div className='w-full h-[1px] border-dashed border-black border-[1px] '></div>
                <div className='flex flex-row'>
                  <p className='text-regularText leading-[150%] font-roboto'>Total Amount</p>
                  <p className='text-regularText ml-auto text-right leading-[150%] font-roboto'>{formatINR(totalAmount)}</p>
                </div>

              </div>
                    <TitleButton2 
                        className='mt-[1.25vw] mx-auto bg-black w-[100%]' 
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={loading ? "Processing..." : "Proceed to Payment"}
                        onClick={handleRazorpayPayment}  
                        disabled={loading}
                    />
            </div>
    </div>
  )
}

export default Step2
