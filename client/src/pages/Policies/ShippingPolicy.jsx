import React from 'react'

const ShippingPolicy = () => {
  return (
    <div className='w-full'>
      <section className='w-full bg-darkslategrey text-white  px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
            <h2 className='text-h2TextPhone md:text-h1Text font-bold font-dyeLine'>Shipping & Delivery Policy</h2>
            <p className='text-h6TextPhone md:text-h6Text font-dyeLine'>Last Updated on 29 March 2025</p>
      </section>
      <section className='flex flex-col gap-[10vw] md:gap-[2.5vw] w-full font-roboto text-regularTextPhone md:text-regularText  md:w-[57.25vw] px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Introduction</p>
            <p>At Arora Opticals, we aim to deliver your orders in a timely and efficient manner. Please review our shipping and delivery policies below.</p>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>1. Shipping Options & Delivery Time</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>Standard Shipping: Estimated delivery within 5-7 business days.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>Express Shipping: Estimated delivery within 2-4 business days.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>International Shipping: Delivery times vary by destination. Please check during checkout.</li>
            </ul>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>2. Order Processing Time</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>Orders are processed within 1-2 business days.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>Processing times may be extended during peak seasons or holidays.</li>
            </ul>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>3. Shipping Charges</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>Shipping costs are calculated at checkout based on location and delivery method.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>Free shipping is available for orders above Rs.999/-</li>
            </ul>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>4. Tracking Your Order</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>Once your order is shipped, you will receive a tracking number via email.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>You can track your order on our website or through the carrier’s tracking system.</li>
            </ul>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>5. Delivery Issues</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>If your package is delayed or lost, please contact our support team at <a href="mailto:support@gmail.com">support@gmail.com</a></li>
                <li className='pl-[2vw] md:pl-[.5vw]'>In case of incorrect address details, additional shipping charges may apply.</li>
            </ul>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>6. International Shipping</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'>Customers are responsible for any customs duties, taxes, or additional fees imposed by their country.</li>
                <li className='pl-[2vw] md:pl-[.5vw]'>International delivery times vary and are subject to customs clearance.</li>
            </ul>
            <p>For any shipping-related inquiries, feel free to reach out to us at <a href="mailto:aroraopticalssadar@gmail.com">aroraopticalssadar@gmail.com</a>.</p>
        </div>


      </section>
    </div>
  )
}

export default ShippingPolicy
