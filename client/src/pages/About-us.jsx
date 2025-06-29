import React from 'react'

import aboutusImage from '../assets/images/about-us/about-us.png'
import aboutusImageGallery1 from '../assets/images/about-us/about-us-image-gallery1.png'
import aboutusImageGallery2 from '../assets/images/about-us/about-us-image-gallery2.png'
import aboutusImageGallery3 from '../assets/images/about-us/about-us-image-gallery3.png'
import aboutusImageGallery4 from '../assets/images/about-us/about-us-image-gallery4.png'
import aboutusImageGallery5 from '../assets/images/about-us/about-us-image-gallery5.png'
import { TransitionLink } from '@/Routes/TransitionLink'


export default function AboutUs() {
  return (
    <div className='flex flex-col md:mt-[7.25vw] md:gap-[3.75vw]'>
        {/* First Section */}
      <div className='flex flex-row  mx-auto  md:gap-[22.5vw]'>
        <div className='flex flex-col '>
            <h1 className='md:text-h1Text leading-[120%] font-bold font-dyeLine'>
                About Us
            </h1>
            <h3 className='text-aboutUsText leading-[120%] font-roboto font-thin'>
                Who we are
            </h3>
        </div>
        <p className='text-regularText leading-[150%] font-roboto md:w-[35vw]'>
        As we Started our Firm, 45 years ago, our Ideology from day one is to serve our customers and advise them to get the product according to their needs. We always have been more and more focused on the after sales part of the business, as it helps us in creating a long-term relationship with the consumer.<br/> <br/> 
        We understood in the start that resolving the vision needs is the first priority in our organization, and after understanding the vision needs, we offer the lenses which will fulfill their needs accordingly.<br/> <br/> 
        The main aim of our organization in after sale services to resolve any kind of problem which a consumer facing with their specs or sunglasses.
        </p>
      </div>

      {/* Second Section */}
      <div className='flex flex-row  mx-auto  md:gap-[6vw] items-center'>
        <div className='flex flex-col md:gap-[3.375vw]'>
            <h2 className='md:text-h2Text leading-[120%] font-bold font-dyeLine'>
                Our Mission
            </h2>
            <p className='md:text-regularText  leading-[150%] font-roboto  md:w-[18.75vw]'>
            We are committed to provide all kind of eyeglasses to people irrespective their budget and choice; dispense best quality lenses for natural vision. We aim to be honest in our work and transparent with our customers, this helps us creating a client centric environment, which therefore helps us in achieving and ethical and honest work culture.
            </p>
        </div>

        <img src={aboutusImage} alt='about-us' className='w-[33.125vw] h-[33.125vw] object-cover' />

        <div className='flex flex-col md:gap-[3.375vw]'>
            <h2 className='md:text-h2Text leading-[120%] font-bold font-dyeLine text-right'>
                Our Vision
            </h2>
            <p className='md:text-regularText leading-[150%] font-roboto  md:w-[18.75vw] text-right'>
            Our Vision is to be a brand which is known for its Transparency and Quality, and as we expand our operations and make the brand global, we want to be known as a reliable and customer driven brand.
            </p>
        </div>
        
      </div>

      {/* Third Section */}
      <div className='flex flex-row  mx-auto  md:gap-[6vw] items-center'>
        <div className='flex flex-col md:gap-[3.375vw]'>
            <h2 className='md:text-h2Text leading-[120%] font-bold font-dyeLine text-center'>
                History
            </h2>
            <p className='text-regularText leading-[150%] font-roboto  md:w-[67.5vw] text-justify'>
            Back in 2002, we started our journey in the Optical Industry in a small-town Jhansi. As the Industry trends shifted from a need base demand to a fashion-based demand, we introduced designer home brands as well as international brands in the market. People also demanded for that reason; we tried to provide according to the needs of the consumers. As the Global trends on Sunglasses shifted and big players entered the market, we decided in 2003 to venture the Luxottica, an Italian Brand, and we started offering their brands such as Ray-Ban and Vogue.<br/><br/>In 2010 we officially became a Luxottica Authorized Store, and started selling most of international brands in our town.<br/><br/>  Moving Forward in 2020, we started the special Services of Authentic Prescription Glasses of Ray-Ban and Oakley. Also, we started providing Customization in Ray-Ban and Oakley, better known as Ray-Ban Remix and Oakley Custom respectively.
            </p>
        </div>        
      </div>

      {/* Image Gallery Section */}
      <div className='flex flex-row  mx-auto  md:gap-[6vw] items-center md:my-[6vw]'>
        <div className='flex flex-col md:gap-[3.375vw]'>
            <h2 className='md:text-h2Text leading-[120%] font-bold font-dyeLine text-center'>
                Image Gallery
            </h2>
            <div className='flex flex-row md:gap-[2vw]'>
                <img src={aboutusImageGallery1} alt='about-us' className='md:w-[39vw] h-auto object-cover' />
                <div className='flex flex-col md:gap-[2vw]'>
                    <div className='flex flex-row md:gap-[2vw]'>
                    <img src={aboutusImageGallery2} alt='about-us' className='md:w-[18.5vw] h-auto object-cover' />
                    <img src={aboutusImageGallery3} alt='about-us' className='md:w-[18.5vw] h-auto object-cover' />                    
                    </div>
                    <div className='flex flex-row md:gap-[2vw]'>
                    <img src={aboutusImageGallery4} alt='about-us' className='md:w-[18.5vw] h-auto object-cover' />
                    <img src={aboutusImageGallery5} alt='about-us' className='md:w-[18.5vw] h-auto object-cover' />                    
                    </div>
                </div>
            </div>
        </div>        
      </div>

      {/* Connect With Us Section */}
      <div className="p-[4vw] ">
      <h2 className='md:text-h2Text leading-[120%] font-bold font-dyeLine md:mb-[3vw]'>
                Connect with Us
            </h2>
            <div className='flex justify-between'>

                <div className='flex flex-row '>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-[2vw] h-[2vw] mr-[1.5vw] flex-shrink-0'>
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <div className='flex flex-col md:gap-[0.5vw]'>
                        <p className='text-h5Text leading-[120%] font-roboto'>
                            <span className='font-bold'>Email</span>
                        </p>
                        <p className='text-[#757575] text-regularText leading-[150%] font-roboto'>
                        <a href="mailto:support@aroraopticals.com" className="underline md:no-underline hover:underline">
                            support@aroraopticals.com
                        </a>
                        </p>
                    </div>
                </div>

                <div className='flex flex-row '>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-[2vw] h-[2vw] mr-[1.5vw] flex-shrink-0'>
                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9844 21.5573 21.2136 21.3521 21.4019C21.1469 21.5902 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09494 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65182C2.82196 2.44695 3.04988 2.28335 3.30379 2.17138C3.5577 2.05941 3.83231 2.00152 4.10999 2H7.10999C7.59522 1.99522 8.06569 2.16708 8.43373 2.48353C8.80177 2.79999 9.04201 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89382 7.65343C9.81416 8.03011 9.62984 8.37754 9.35999 8.65L8.08999 9.92C9.51355 12.4135 11.5865 14.4865 14.08 15.91L15.35 14.64C15.6225 14.3702 15.9699 14.1859 16.3466 14.1062C16.7233 14.0266 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <div className='flex flex-col md:gap-[0.5vw]'>
                        <p className='text-h5Text leading-[120%] font-roboto'>
                            <span className='font-bold'>Phone</span>
                        </p>
                        <p className='text-[#757575] text-regularText leading-[150%] font-roboto'>
                        <a href="tel:+919415031678" className="underline md:no-underline hover:underline">+91 9415031678</a><br/> <a href="tel:+917007946072" className="underline md:no-underline hover:underline">+91 7007946072</a>
                        </p>
                    </div>
                </div>

                <div className='flex flex-row '>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-[2vw] h-[2vw] mr-[1.5vw] flex-shrink-0'>
                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="10" r="3" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <div className='flex flex-col md:gap-[0.5vw]'>
                        <p className='text-h5Text leading-[120%] font-roboto'>
                            <span className='font-bold'>Address</span>
                        </p>
                        <p className='text-[#757575] text-regularText  leading-[150%] font-roboto'>
                        Arora Opticals, Civil Lines, Cantt<br/>Jhansi, Uttar Pradesh 284001
                        </p>
                    </div>
                </div>
                <TransitionLink to='/eye-test'>
                <div className='flex flex-row '>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-[2vw] h-[2vw] mr-[1.5vw] flex-shrink-0'>
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <div className='flex flex-col md:gap-[0.5vw]'>
                        <p className='text-h5Text leading-[120%] font-roboto'>
                            <span className='font-bold'>Book Free Eye Test</span>
                        </p>
                        <p className='text-[#757575] text-regularText leading-[150%] font-roboto'>
                            Schedule your appointment
                        </p>
                    </div>
                </div>
                </TransitionLink>
                
            </div>
        
      </div>
    </div>
  )
}
