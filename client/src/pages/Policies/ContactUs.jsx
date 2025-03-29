import React from 'react'
import StoreImg from '../../assets/images/homePage/store2.webp'
import { IconButton } from '@/components/button'
import { TitleButton } from '@/components/button'
const ContactUs = () => {
  return (
    <div className='w-full'>
      <section className='w-full bg-darkslategrey text-white  px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
            <h2 className='text-h2TextPhone md:text-h1Text font-bold font-dyeLine'>Contact Us</h2>
      </section>
      <section className='w-full font-roboto text-regularTextPhone md:text-regularText mx-auto md:p-[4vw] md:w-[75vw] px-[5vw]  my-[10vw] md:my-[6.25vw]'>
        <div className='flex flex-col gap-[3vw] md:gap-[3vw]'>
            <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
                <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Customer Support</p>
                <p>We’d love to hear from you! Whether you have questions about our products, need assistance with an order, or just want to say hello, feel free to reach out to us using the details below:</p>
            </div>
            <div className='flex flex-col md:flex-row gap-[5vw] md:gap-[1.25vw] justify-between'>
                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.19922 32.7857V6.39995C4.19922 5.78728 4.4057 5.28768 4.84633 4.84706C5.28695 4.40643 5.78654 4.19995 6.39922 4.19995H31.9992C32.6119 4.19995 33.1115 4.40643 33.5521 4.84706C33.9927 5.28768 34.1992 5.78727 34.1992 6.39995V25.6C34.1992 26.2126 33.9927 26.7122 33.5521 27.1528C33.1115 27.5935 32.6119 27.8 31.9992 27.8H9.59922H9.18501L8.89211 28.0928L4.19922 32.7857Z" stroke="black" stroke-width="2"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Chat with Us</p>
                        <p className='text-[#757575]'>We are here to help you.</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>Whatsapp: 094150 31678</p>
                    </div>
                </div>

                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg  className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.5358 27.0721V31.8721C35.5376 32.3177 35.4464 32.7588 35.2678 33.1671C35.0893 33.5753 34.8275 33.9418 34.4992 34.2431C34.1708 34.5443 33.7831 34.7737 33.361 34.9164C32.9389 35.0592 32.4916 35.1122 32.0478 35.0721C27.1244 34.5371 22.395 32.8547 18.2398 30.1601C14.374 27.7036 11.0964 24.426 8.63983 20.5601C5.9358 16.386 4.25302 11.6337 3.72783 6.68811C3.68785 6.24565 3.74043 5.79972 3.88223 5.37871C4.02403 4.95769 4.25194 4.57081 4.55146 4.2427C4.85097 3.91459 5.21552 3.65244 5.6219 3.47294C6.02827 3.29344 6.46758 3.20052 6.91183 3.20011H11.7118C12.4883 3.19246 13.2411 3.46743 13.8298 3.97376C14.4186 4.48009 14.8032 5.18322 14.9118 5.95211C15.1144 7.48821 15.4901 8.99647 16.0318 10.4481C16.2471 11.0208 16.2937 11.6432 16.1661 12.2415C16.0385 12.8399 15.742 13.3891 15.3118 13.8241L13.2798 15.8561C15.5575 19.8618 18.8742 23.1784 22.8798 25.4561L24.9118 23.4241C25.3469 22.9939 25.8961 22.6975 26.4944 22.5699C27.0928 22.4422 27.7152 22.4888 28.2878 22.7041C29.7395 23.2458 31.2477 23.6215 32.7838 23.8241C33.5611 23.9338 34.2709 24.3252 34.7783 24.9241C35.2857 25.523 35.5553 26.2874 35.5358 27.0721Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Call Us</p>
                        <p className='text-[#757575]'>Phone</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>094150 31678</p>
                    </div>
                </div>

                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.8492 3.19995C11.0172 3.19995 3.86523 10.368 3.86523 19.2C3.86523 28.032 11.0172 35.2 19.8492 35.2C28.6972 35.2 35.8652 28.032 35.8652 19.2C35.8652 10.368 28.6972 3.19995 19.8492 3.19995ZM19.8652 32C12.7932 32 7.06523 26.272 7.06523 19.2C7.06523 12.128 12.7932 6.39995 19.8652 6.39995C26.9372 6.39995 32.6652 12.128 32.6652 19.2C32.6652 26.272 26.9372 32 19.8652 32Z" fill="black"/>
                    <path d="M20.6656 11.2H18.2656V20.8L26.6656 25.8399L27.8656 23.872L20.6656 19.6V11.2Z" fill="black"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Business Hours</p>
                        <p className='text-[#757575]'>Visit us anytime between.</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>10:30 am–8:30 pm</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
                <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Follow Us</p>
                <p>Stay updated with our latest collections and offers by following us on social media:</p>
            </div>
            <div className='flex flex-col md:flex-row gap-[5vw] md:gap-[1.25vw] justify-between'>
                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.19922 32.7857V6.39995C4.19922 5.78728 4.4057 5.28768 4.84633 4.84706C5.28695 4.40643 5.78654 4.19995 6.39922 4.19995H31.9992C32.6119 4.19995 33.1115 4.40643 33.5521 4.84706C33.9927 5.28768 34.1992 5.78727 34.1992 6.39995V25.6C34.1992 26.2126 33.9927 26.7122 33.5521 27.1528C33.1115 27.5935 32.6119 27.8 31.9992 27.8H9.59922H9.18501L8.89211 28.0928L4.19922 32.7857Z" stroke="black" stroke-width="2"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Facebook</p>
                        <p className='text-[#757575]'>We are here to help you.</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>Whatsapp: 094150 31678</p>
                    </div>
                </div>

                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg  className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.5358 27.0721V31.8721C35.5376 32.3177 35.4464 32.7588 35.2678 33.1671C35.0893 33.5753 34.8275 33.9418 34.4992 34.2431C34.1708 34.5443 33.7831 34.7737 33.361 34.9164C32.9389 35.0592 32.4916 35.1122 32.0478 35.0721C27.1244 34.5371 22.395 32.8547 18.2398 30.1601C14.374 27.7036 11.0964 24.426 8.63983 20.5601C5.9358 16.386 4.25302 11.6337 3.72783 6.68811C3.68785 6.24565 3.74043 5.79972 3.88223 5.37871C4.02403 4.95769 4.25194 4.57081 4.55146 4.2427C4.85097 3.91459 5.21552 3.65244 5.6219 3.47294C6.02827 3.29344 6.46758 3.20052 6.91183 3.20011H11.7118C12.4883 3.19246 13.2411 3.46743 13.8298 3.97376C14.4186 4.48009 14.8032 5.18322 14.9118 5.95211C15.1144 7.48821 15.4901 8.99647 16.0318 10.4481C16.2471 11.0208 16.2937 11.6432 16.1661 12.2415C16.0385 12.8399 15.742 13.3891 15.3118 13.8241L13.2798 15.8561C15.5575 19.8618 18.8742 23.1784 22.8798 25.4561L24.9118 23.4241C25.3469 22.9939 25.8961 22.6975 26.4944 22.5699C27.0928 22.4422 27.7152 22.4888 28.2878 22.7041C29.7395 23.2458 31.2477 23.6215 32.7838 23.8241C33.5611 23.9338 34.2709 24.3252 34.7783 24.9241C35.2857 25.523 35.5553 26.2874 35.5358 27.0721Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Call Us</p>
                        <p className='text-[#757575]'>Phone</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>094150 31678</p>
                    </div>
                </div>

                <div className='flex flex-col p-[6vw] md:p-[1.5vw] gap-[15vw] md:gap-[4vw] w-full md:w-[20.3125vw] rounded-[1vw] border-[1px] border-solid border-[#D9D9D9]'>
                <svg className='w-[9.5vw] md:w-[2.375vw] h-auto' viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.8492 3.19995C11.0172 3.19995 3.86523 10.368 3.86523 19.2C3.86523 28.032 11.0172 35.2 19.8492 35.2C28.6972 35.2 35.8652 28.032 35.8652 19.2C35.8652 10.368 28.6972 3.19995 19.8492 3.19995ZM19.8652 32C12.7932 32 7.06523 26.272 7.06523 19.2C7.06523 12.128 12.7932 6.39995 19.8652 6.39995C26.9372 6.39995 32.6652 12.128 32.6652 19.2C32.6652 26.272 26.9372 32 19.8652 32Z" fill="black"/>
                    <path d="M20.6656 11.2H18.2656V20.8L26.6656 25.8399L27.8656 23.872L20.6656 19.6V11.2Z" fill="black"/>
                </svg>
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw]' >
                        <p className='text-mediumTextPhone md:text-mediumTextPhone font-bold '>Business Hours</p>
                        <p className='text-[#757575]'>Visit us anytime between.</p>
                        <p className='text-mediumTextPhone md:text-mediumTextPhone '>10:30 am–8:30 pm</p>
                    </div>
                </div>
            </div>
            <span className='text-regularTextPhone md:text-regularText mx-auto text-[#757575]'>We are here to help and ensure you have the best shopping experience with aroraopticals.com</span>
            <div className='flex flex-col gap-[5vw] md:gap-0
             md:flex-row mt-[5vw] md:mt-[6.25vw]'>
                <div className='flex-shrink-0 md:ml-[2.25vw] md:w-[28.75vw] md:h-[28.75vw] flex flex-col gap-[6vw] md:gap-[1vw] justify-center'>
                                    <h2 className='text-center font-dyeLine  leading-[120%]  text-h4TextPhone md:text-h2Text font-bold '>
                                    Store Address
                                    </h2>
                                    <span className='font-roboto text-center text-[14px] md:text-regularText '>
                                    Arora Opticals Civil Lines, Cantt, Jhansi<br/> Uttar Pradesh 284001
                                    </span>
                                    <div className='mx-auto flex flex-row  md:mt-[1vw] gap-[.1vw] group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 '>
                                        <TitleButton btnHeightPhone={12.5} btnWidthPhone={47}  btnRadiusPhone={9} btnTitle={"Locate Our Store"} btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                                        <IconButton btnSizePhone={12.5}  iconWidthPhone={14} paddingPhone={1} btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                                    </div>
                                </div>
                
                                <div  className=' relative md:w-[28.75vw] md:h-[28.75vw] rounded-[9.5vw] md:rounded-[3.125vw] overflow-hidden'>
                                        <a href='https://maps.app.goo.gl/LCz66ym3VdrnA2wH7'>
                                        <img className='w-full h-full' src={StoreImg}/>
                                        <div className='absolute right-[6vw] top-[6vw] md:right-[1.5vw] md:top-[1.5vw] flex flex-row items-center gap-[1.75vw] md:gap-[.5vw]' >
                                            <span className='text-white  text-smallTextPhone md:text-mediumText text-center font-roboto'>
                                                View in Maps
                                            </span>
                                            <IconButton btnSizePhone={9.5} iconWidthPhone={20} paddingPhone={1} btnSize={3.0625} iconWidth={2.1875} padding={0.8} className=''/>
                                        </div>
                                        <div className='absolute text-white bottom-[6vw] md:bottom-[1.5vw] left-[6vw] md:left-[1.5vw] '>
                                            <h3 className='text-h5TextPhone leading-[120%] font-dyeLine font-bold md:text-h3Text'>
                                                Arora Optical
                                            </h3>
                                            <h6 className='text-h6TextPhone leading-[150%] font-dyeLine md:text-h6Text font-bold'>
                                                Store Locator
                                            </h6>
                
                                        </div>
                                        </a>
                                </div>
            </div>
        </div>        

      </section>
    </div>
  )
}

export default ContactUs
