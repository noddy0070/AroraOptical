import React, { useState } from 'react'
import { TitleButton2 } from '@/components/button';
import { formatINR } from '@/components/IntToPrice';

const Step2 = ({ cartItems, setStep }) => {
    const [paymentMethod, setPaymentMethod] = useState("upi");
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
                        onClick={() => {setStep(1)}}  
                    />
            </div>
    </div>
  )
}

export default Step2
