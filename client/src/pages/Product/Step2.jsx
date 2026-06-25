import { useState } from 'react'
import { TitleButton2 } from '@/components/button';
import { formatINR } from '@/components/IntToPrice';
import axios from 'axios';
import { baseURL } from '@/url';
import { useSelector } from 'react-redux';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const Step2 = ({ cartItems, setStep, shippingAddress, deliveryPrice }) => {
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.totalAmount * item.quantity), 0) + (deliveryPrice || 0);
    const isCOD = paymentMethod === 'cash on delivery';

    const handleCODOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseURL}/api/order/create-cod`,
                {
                    cartItems,
                    totalAmount,        // rupees — no conversion needed for COD
                    deliveryCharges: deliveryPrice || 0,
                    shippingAddress,
                    userId: user._id,
                    notes: 'None for now',
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                window.location.href = '/thank-you';
            }
        } catch (error) {
            console.error('COD order error:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        setLoading(true);
        // totalAmount in paise for both PhonePe and the mock endpoint
        const totalAmountPaise = Math.round(totalAmount * 100);
        const data = {
            cartItems,
            totalAmount: totalAmountPaise,
            deliveryCharges: deliveryPrice || 0,
            shippingAddress,
            userId: user._id,
            notes: 'None for now',
        };

        try {
            if (isLocalhost) {
                // Use mock endpoint on localhost — avoids PhonePe redirect loop
                const response = await axios.post(`${baseURL}/api/order/create-mock`, data, { withCredentials: true });
                if (response.data.success) {
                    window.location.href = '/thank-you';
                }
            } else {
                const response = await axios.post(`${baseURL}/api/order/create-phonepe`, data, { withCredentials: true });
                if (response.data?.checkoutPageUrl) {
                    window.location.assign(response.data.checkoutPageUrl);
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert(error.response?.data?.message || 'Unable to start payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = () => {
        if (isCOD) {
            handleCODOrder();
        } else {
            handleOnlinePayment();
        }
    };

    const btnTitle = loading
        ? 'Processing...'
        : isCOD
            ? 'Place Order'
            : isLocalhost
                ? 'Simulate Payment (Dev)'
                : 'Proceed to Payment';

    return (
        <div className='mx-[5vw] md:mx-[5vw] px-[5vw] md:px-[12vw] py-[6vw] md:py-[1.875vw] bg-[#FAFAFA] flex flex-col md:flex-row gap-[6vw] md:gap-[2vw]'>
            <div className='flex flex-col gap-[4vw] md:gap-[1vw] text-[#17183B] w-full md:w-[31vw] p-[4vw] md:p-[16px]'>
                <p className='text-mediumTextPhone md:text-mediumText leading-[150%] text-black font-roboto font-bold'>Payment Method</p>
                <label className='flex flex-row gap-[4vw] md:gap-[16px] items-center'>
                    <input type="radio" name="paymentMethod" className='w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] accent-black' checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                    <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>UPI</p>
                </label>
                <label className='flex flex-row gap-[4vw] md:gap-[16px] items-center'>
                    <input type="radio" name="paymentMethod" className='w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] accent-black' checked={paymentMethod === "credit/debit card"} onChange={() => setPaymentMethod("credit/debit card")} />
                    <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>Credit/Debit Card</p>
                </label>
                <label className='flex flex-row gap-[4vw] md:gap-[16px] items-center'>
                    <input type="radio" name="paymentMethod" className='w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] accent-black' checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
                    <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>Net Banking</p>
                </label>
                <label className='flex flex-row gap-[4vw] md:gap-[16px] items-center'>
                    <input type="radio" name="paymentMethod" className='w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] accent-black' checked={paymentMethod === "cash on delivery"} onChange={() => setPaymentMethod("cash on delivery")} />
                    <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>Cash on Delivery</p>
                </label>
                {isLocalhost && !isCOD && (
                    <p className='text-smallTextPhone md:text-smallText text-amber-600 mt-[2vw] md:mt-2'>
                        Dev mode: online payments use the mock endpoint — no real PhonePe redirect.
                    </p>
                )}
            </div>

            <div className='flex flex-col gap-[4vw] md:gap-[1.5vw] w-full md:w-[37.5vw] p-[4vw] md:p-[16px]'>
                <p className='text-h6TextPhone md:text-h6Text leading-[150%] font-roboto font-bold'>Order Summary</p>
                <div className='flex flex-col gap-[4vw] md:gap-[1.5vw] w-full'>
                    {cartItems.map((item) => (
                        <div key={item.productId._id} className='flex flex-row gap-[3vw] md:gap-[1.5vw] border-[1px] border-[#f5f5f5] rounded-[2vw] md:rounded-[8px] p-[2vw] md:p-[8px]'>
                            <img src={item.productId.images[0]} alt="item" className='w-[25vw] md:w-[3.125vw] h-[25vw] md:h-[3.375vw] object-cover rounded-[2vw] md:rounded-none' />
                            <div className='flex flex-col gap-[1vw] md:gap-[4px] flex-1'>
                                <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold'>{item.productId.modelTitle}</p>
                                <p className='text-smallTextPhone md:text-smallText leading-[150%] font-roboto'>{item.productId.brand}</p>
                            </div>
                            <p className='text-smallTextPhone md:text-smallText leading-[150%] font-bold font-roboto text-right ml-auto'>{item.quantity} x {formatINR(item.totalAmount)}</p>
                        </div>
                    ))}
                    <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold mt-[2vw] md:mt-0'>Total Payable</p>
                    <div className='flex flex-row'>
                        <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>MRP (Incl. Tax)</p>
                        <p className='text-regularTextPhone md:text-regularText ml-auto text-right leading-[150%] font-roboto'>
                            {formatINR(cartItems.reduce((acc, item) => acc + (item.totalAmount * item.quantity), 0))}
                        </p>
                    </div>
                    <div className='flex flex-row'>
                        <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto'>Delivery Charges</p>
                        <p className='text-regularTextPhone md:text-regularText ml-auto text-right leading-[150%] font-roboto'>{formatINR(deliveryPrice)}</p>
                    </div>
                    <div className='w-full h-[1px] border-dashed border-black border-[1px]'></div>
                    <div className='flex flex-row'>
                        <p className='text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold'>Total Amount</p>
                        <p className='text-regularTextPhone md:text-regularText ml-auto text-right leading-[150%] font-roboto font-bold'>{formatINR(totalAmount)}</p>
                    </div>
                </div>
                <TitleButton2
                    className='mt-[5vw] md:mt-[1.25vw] mx-auto bg-black w-full md:w-[100%]'
                    btnHeightPhone={12}
                    btnWidthPhone={100}
                    btnRadiusPhone={12}
                    btnHeight={3}
                    btnWidth={30}
                    btnRadius={2}
                    btnTitle={btnTitle}
                    onClick={handlePayment}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default Step2;
