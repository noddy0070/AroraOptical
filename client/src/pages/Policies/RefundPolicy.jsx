import React from 'react'

const RefundPolicy = () => {
  return (
    <div className='w-full'>
      <section className='w-full bg-darkslategrey text-white  px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
            <h2 className='text-h2TextPhone md:text-h1Text font-bold font-dyeLine'>Cancellation and Refund Policy</h2>
            <p className='text-h6TextPhone md:text-h6Text font-dyeLine'>Last Updated on 29 March 2025</p>
      </section>
      <section className='flex flex-col gap-[10vw] md:gap-[2.5vw] w-full font-roboto text-regularTextPhone md:text-regularText  md:w-[57.25vw] px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
      <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Introduction</p>
            <p>At Arora Opticals, we strive to ensure customer satisfaction. If you are not entirely satisfied with your purchase, we’re here to help.</p>
        </div>

<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
    <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>1. Order Cancellation</p>
    <ul className='list-disc list-inside'>
        <li className='pl-[2vw] md:pl-[.5vw]'>Orders can be canceled within 24 hours of placement without any charges</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Once an order has been processed or shipped, it cannot be canceled.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>To request a cancellation, please contact our customer support team at <a className='underline' href="mailto:support@aroraopticals.com">support@aroraopticals.com</a></li>
  </ul>
</div>

<div className='flex flex-col gap-[5vw] md:gap-[1.25vw] '>
    <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>2. Refund Policy</p>
    <div className='pl-[4vw] md:pl-[2vw] flex flex-col gap-[5vw] md:gap-[1.25vw]'>
<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
    <p className='font-bold font-dyeLine text-h4TextPhone md:text-h4Text leading-[120%] '>2.1 Eligibility for Refunds</p>
    <ul className='list-disc list-inside'>
        <li className='pl-[2vw] md:pl-[.5vw]'>Refunds are applicable for defective or incorrect items received.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Items must be returned in their original packaging, unused, and in the same condition as received.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Refund requests must be made within 7 days of receiving the product.</li>
    </ul>
</div>

<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
    <p className='font-bold font-dyeLine text-h4TextPhone md:text-h4Text leading-[120%] '>2.2 Non-Refundable Items</p>
    <ul className='list-disc list-inside'>
        <li className='pl-[2vw] md:pl-[.5vw]'>Customized or prescription eyewear is non-refundable unless there is a manufacturing defect.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Items purchased on sale or clearance are not eligible for refunds.</li>
    </ul>
</div>
</div>
</div>


<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
<p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>3. Return & Exchange Process</p>
    <ul className='list-disc list-inside'>
        <li className='pl-[2vw] md:pl-[.5vw]'>To initiate a return, email us at <a href="mailto:support@aroraopticals.com">support@aroraopticals.com</a> with your order details and reason for return.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Our team will provide instructions and a return shipping address.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Once we receive and inspect the item, we will process the refund within 5-7 days.</li>
    </ul>
   
</div>

<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
    <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>4. Refund Processing</p>
    <ul className='list-disc list-inside'>
        <li className='pl-[2vw] md:pl-[.5vw]'>Refunds will be issued to the original payment method used for the purchase.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Processing time may vary depending on your bank or payment provider.</li>
        <li className='pl-[2vw] md:pl-[.5vw]'>Shipping costs are non-refundable unless the return is due to our error.</li>
    </ul>
</div>

<div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
    <p>For further assistance, contact us at:</p>
        <ul className='list-disc list-inside'>
            <li className='pl-[2vw] md:pl-[.5vw]'><strong>Email:</strong> <a href="mailto:aroraopticalssadar@gmail.com">aroraopticalssadar@gmail.com</a></li>
            <li className='pl-[2vw] md:pl-[.5vw]'><strong>Phone:</strong><a href="tel:+9415031678"> 7067778515</a></li>
        </ul>
</div>


      </section>
    </div>
  )
}

export default RefundPolicy
