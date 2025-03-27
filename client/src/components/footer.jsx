import logo from '../assets/images/AroraOpticalLogo.png';
const Footer=()=>{
    return(
        <footer className="footer py-[7vw] md:py-[5vw]  md:px-[2vw] font-roboto text-regularTextPhone md:text-regularText flex flex-col md:gap-[5vw] gap-[20vw]">
        <div className="flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw] ">
            <div className='flex flex-col gap-[6vw] md:gap-[1.5vw]'>
                <img src={logo} alt='logo' className='mb-[2vw] md:mb-[.5vw] h-[19vw] w-[27vw] md:w-[6.75vw] md:h-[4.75vw]' />
                <span><strong>Address:</strong><br className='block md:hidden'/> Arora Opticals, Civil Lines, Cantt, Jhansi, Uttar Pradesh 284001</span>
                <span><strong>Contact:<br/></strong><a href="tel:+9415031678" className="underline md:no-underline hover:underline">
                    9415031678
                    </a><br/><a href="mailto:aroraopticalssadar@gmail.com" className="underline md:no-underline  hover:underline">
  aroraopticalssadar@gmail.com
</a>
</span>
<div className='flex flex-row gap-[3vw] md:gap-[.75vw]'>
    
    <svg id="facebook" className='w-[6vw] md:w-[1.5vw] h-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12.3038C22 6.74719 17.5229 2.24268 12 2.24268C6.47715 2.24268 2 6.74719 2 12.3038C2 17.3255 5.65684 21.4879 10.4375 22.2427V15.2121H7.89844V12.3038H10.4375V10.0872C10.4375 7.56564 11.9305 6.1728 14.2146 6.1728C15.3088 6.1728 16.4531 6.36931 16.4531 6.36931V8.84529H15.1922C13.95 8.84529 13.5625 9.6209 13.5625 10.4166V12.3038H16.3359L15.8926 15.2121H13.5625V22.2427C18.3432 21.4879 22 17.3257 22 12.3038Z" fill="black"/>
    </svg>


    <svg id='instagram' className='w-[6vw] md:w-[1.5vw] h-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 3.24268H8C5.23858 3.24268 3 5.48126 3 8.24268V16.2427C3 19.0041 5.23858 21.2427 8 21.2427H16C18.7614 21.2427 21 19.0041 21 16.2427V8.24268C21 5.48126 18.7614 3.24268 16 3.24268ZM19.25 16.2427C19.2445 18.0353 17.7926 19.4872 16 19.4927H8C6.20735 19.4872 4.75549 18.0353 4.75 16.2427V8.24268C4.75549 6.45003 6.20735 4.99817 8 4.99268H16C17.7926 4.99817 19.2445 6.45003 19.25 8.24268V16.2427ZM16.75 8.49268C17.3023 8.49268 17.75 8.04496 17.75 7.49268C17.75 6.9404 17.3023 6.49268 16.75 6.49268C16.1977 6.49268 15.75 6.9404 15.75 7.49268C15.75 8.04496 16.1977 8.49268 16.75 8.49268ZM12 7.74268C9.51472 7.74268 7.5 9.7574 7.5 12.2427C7.5 14.728 9.51472 16.7427 12 16.7427C14.4853 16.7427 16.5 14.728 16.5 12.2427C16.5027 11.0484 16.0294 9.90225 15.1849 9.05776C14.3404 8.21327 13.1943 7.74002 12 7.74268ZM9.25 12.2427C9.25 13.7615 10.4812 14.9927 12 14.9927C13.5188 14.9927 14.75 13.7615 14.75 12.2427C14.75 10.7239 13.5188 9.49268 12 9.49268C10.4812 9.49268 9.25 10.7239 9.25 12.2427Z" fill="black"/>
    </svg>


    <svg id="X" className='w-[6vw] md:w-[1.5vw] h-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.1761 4.24268H19.9362L13.9061 11.0201L21 20.2427H15.4456L11.0951 14.6493L6.11723 20.2427H3.35544L9.80517 12.9935L3 4.24268H8.69545L12.6279 9.3553L17.1761 4.24268ZM16.2073 18.6181H17.7368L7.86441 5.78196H6.2232L16.2073 18.6181Z" fill="black"/>
    </svg>
    
</div>
            </div>
            <div className="ml-auto w-full md:w-[16.25vw] flex flex-col gap-[3vw] md:gap-[.75vw] md:text-smallText">
                <span>Eyeglasses</span>
                <span>Sunglasses</span>
                <span>Contact Lenses</span>
                <span>Computer Glasses</span>
                <span>Accessories</span>
                <span></span>
            </div>
            <div className="w-full md:w-[16.25vw] flex flex-col gap-[3vw] md:gap-[.75vw]">
                <span>Shop</span>
                <span>Men</span>
                <span>Women</span>
                <span>Brands</span>
                <span>Blog</span>
                <span>About Us</span>
                <span>Free Eye Test</span>
            </div>
            
        </div>
        <div className="flex flex-row gap-[3vw] md:gap-[1.5vw] py-[8vw] md:py-[2vw] underline text-nowrap text-[12px] md:text-smallText border-t-2 border-black">
            <span>All rights reserved.</span>
            <span className="ml-auto">Privacy Policy</span>
            <span >Terms of Service</span>
        </div>
        </footer>
    )
}

export default Footer;