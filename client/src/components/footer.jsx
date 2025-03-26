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