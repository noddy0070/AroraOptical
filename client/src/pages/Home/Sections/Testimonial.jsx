import React,{useState,useEffect,useRef} from 'react';
import star from '../../../assets/images/star.png';
import { IconButton, TitleButton } from '../../../components/button';
import TestimonialImage1 from '../../../assets/images/homePage/testimonial1.png';
import TestimonialImage2 from '../../../assets/images/homePage/testimonial2.png';
import TestimonialImage3 from '../../../assets/images/homePage/testimonial3.png';
import videoPlaceholder from '../../../assets/images/homePage/videoPlacehlder.webp';
const testimonials = [
    { src: TestimonialImage1,review:"Had a fantastic shopping experience at Arora Opticals! The staff was knowledgeable, the variety of eyewear impressive, and the service impeccable. Found the perfect pair effortlessly. Highly recommend! 👓🛍️",rating:5, name:"Varum Diwan",location:"Lalitpur", alt:"testimonialProfile",},
    { src: TestimonialImage2,review:"Best optical in jhansi good behavior perfact eye testing perfectly done quick service very gental and great personality owner",rating:5, name:"Devandra Sharma",location:"Jhansi", alt:"testimonialProfile",},
    { src: TestimonialImage3,review:"Great place for buying latest spectacles. The staff is very polite and humble. They will also hell you in selecting right frame for you. Over all really good experience. Also, they have all the latest trends, so you will not feel that you are missing out on fashion.",rating:5, name:"Richi Sharma",location:"Jhansi", alt:"testimonialProfile",},
    
]
export default function Testimonial(){
    const [screenWidth, setScreenWidth] = useState(null);

    useEffect(() => {
        // Set initial width
        setScreenWidth(window.innerWidth);
    
        // Handle window resize
        const handleResize = () => {
        setScreenWidth(window.innerWidth);
        };
    
        // Add event listener
        window.addEventListener("resize", handleResize);
    
        // Cleanup event listener on unmount
        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, []);
    const customTestimonialVideoDiv=screenWidth>768?"absolute top-0 shape-div2":"absolute top-0 shape-div2Mobile"
    const customTestimonialTextDiv=screenWidth>768?"shape-div flex flex-col py-[4.5vw] px-[4.5vw] md:py-[2vw] md:px-[2vw] gap-[3.5vw] md:gap-[1vw]  ":"shape-divMobile flex flex-col py-[4.5vw] px-[4.5vw] md:py-[1vw] md:px-[2vw] gap-[3.5vw] md:gap-[1vw] "

    const testimonialRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    
    const handleMouseDown = (e) => {
        setIsMouseDown(true);
        setStartY(e.pageY - testimonialRef.current.offsetTop); // Track the Y position
        setScrollTop(testimonialRef.current.scrollTop); // Get the current scroll position
    };
    
    const handleMouseLeave = () => {
        setIsMouseDown(false);
    };
    
    const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const y = e.pageY - testimonialRef.current.offsetTop; // Get the current Y position
        const walk = (y - startY) * 2; // Determine how much to scroll
        testimonialRef.current.scrollTop = scrollTop - walk; // Scroll the element vertically
    };
    
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };
    
        const handleContextMenu = (e) => {
            e.preventDefault(); // Prevent the right-click context menu      
        }  
    return (
        <div className='py-[6vw] md:py-[7vw] md:px-[4vw] flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw] w-full  md:h-[60.8125vw]  '>
             <div className='relative w-full h-[91vw] md:w-[46.6875vw] md:h-[46.8125vw] shadow-[0px_1.9439252614974976px_15.55px_rgba(0,_0,_0,_0.25)]  overflow-hidden rounded-[5.5vw] md:rounded-[3.125vw]'>
                <img className=' h-full w-full relative' src={videoPlaceholder}></img>
                <div className={customTestimonialVideoDiv}>
                <div className="mx-[2.75vw] md:mx-[2.5vw] my-[2.5vw] md:my-[1.5vw] relative leading-[110%] font-dyeLine font-bold text-black text-left inline-block text-[24px] md:text-h1Text">
                    <p className="m-0">Hear From Our</p>
                    <p className="m-0 text-[40px] md:text-testimonial">
                    <span className="text-h1Text whitespace-pre-wrap">{`   `}</span>
                    <span>Costumers</span>
                    </p>
                    </div>
                </div>
            </div>
            <div ref={testimonialRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className='flex flex-col gap-[6vw] md:gap-[2vw] h-[166vw] md:h-[46.8125vw] w-full md:w-[38vw] overflow-y-auto  hide-scrollbar'>
            {
                testimonials.map((testimonial,index)=>(
                    <div key={index} className={`select-none relative w-full md:w-[38vw]` } >
                        <div className={customTestimonialTextDiv} style={{backgroundColor:index==0?"#1D3240":"#F3E9D2", color:index==0?"white":"black"}}>
                            <div className='flex flex-row gap-[.5vw] md:gap-[.25vw]'>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                                <img src={star} className='w-[2.5vw] md:w-[1.25vw] h-[2.5vw] md:h-[1.25vw]'></img>
                            </div>
                            <div className='h-full  flex flex-col '>
                                <span className='font-roboto leading-[130%] text-[10px] md:text-mediumText line-clamp-4'>
                               {testimonial.review}
                                </span>
                            </div>
                            
                            <div className='flex flex-row gap-[2.75vw] md:gap-[1.25vw] items-center'>
                                <img src={testimonial.src} className='w-[8vw] h-[8vw] md:w-[3.5vw] md:h-[3.5vw]'></img>
                                <span className='text-[9px] md:text-smallText font-semibold font-roboto'>{testimonial.name}</span>
                            </div>

                        </div>
                        <IconButton className={`absolute bottom-0 right-0 ${index==0?"bg-darkslategrey hover:bg-darkslategrey text-white hove:text-white":"bg-btnHoverColour text-black hover:text-black hover:bg-btnHoverColour"}`} btnSizePhone={7} paddingPhone={1} iconWidthPhone={14} btnSize={3} iconWidth={2.1875} padding={0.75}/>
                    </div>
                  

                )
              )
              }
            </div>

        </div>
    );
};
