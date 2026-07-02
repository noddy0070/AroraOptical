import React,{useState,useEffect} from 'react';
import ArrowNorthEast from "../assets/images/ArrowNorthEast.png";
import cartImg from '../assets/images/lensPage/cart.png';


export const IconButton = ({ onClick = () => {}, className = '', iconWidth, btnSize,padding, iconWidthPhone, btnSizePhone, paddingPhone }) => {
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
    }, []); // Empty dependency array ensures this runs once on mount
    return (
        <button
        onClick={()=>{onClick}}
            style={(screenWidth ?? 0) > 768 ? {
                width: `${btnSize}vw`,
                height: `${btnSize}vw`,
                padding: `${padding}vw`,
            }:{width:`${btnSizePhone}vw`,height:`${btnSizePhone}vw`,padding:`${paddingPhone}vw`}}
            className={`bg-darkslategrey shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] text-[#F4F5F9] hover:text-black transition-all duration-700 ease-in-out hover:bg-btnHoverColour flex justify-center items-center rounded-full  ${className}`}
        >
            <svg width={(screenWidth??0)>768?`${iconWidth}vw`:`${iconWidthPhone}`} className=' ' viewBox="0 0 30 29" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.4634 2.33649C29.4867 1.75218 29.032 1.25956 28.4477 1.23619L18.9259 0.855319C18.3416 0.831947 17.849 1.28667 17.8256 1.87098C17.8022 2.45528 18.257 2.9479 18.8413 2.97127L27.3051 3.30983L26.9665 11.7736C26.9432 12.358 27.3979 12.8506 27.9822 12.8739C28.5665 12.8973 29.0591 12.4426 29.0825 11.8583L29.4634 2.33649ZM1.59416 28.484L29.1236 3.0722L27.6872 1.51614L0.157798 26.9279L1.59416 28.484Z"/>
            </svg>

        </button>
    );
};

  
  export const TitleButton = ({ onClick=()=>{}, className = '',btnTitle,btnWidth, btnHeight,btnRadius,className2='text-[16px] md:text-regularText', btnWidthPhone,btnHeightPhone,btnRadiusPhone }) => {
    const [isHovered, setIsHovered] = useState(false);
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
    }, []); // Empty dependency array ensures this runs once on mount
    return (
        <button
        onClick={onClick}
        className={`group bg-darkslategrey text-white shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] transition-all duration-700 ease-in-out hover:bg-btnHoverColour ${className}`}
        style={(screenWidth ?? 0) > 768 ?{
          width: `${btnWidth}vw`,
          height: `${btnHeight}vw`,
          borderRadius: `${btnRadius}vw`
        }:{
          width: `${btnWidthPhone}vw`,
          height: `${btnHeightPhone}vw`,
          borderRadius: `${btnRadiusPhone}vw`
          }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={` text-center font-roboto p-[.1vw]  ${isHovered?'text-black':'text-white'}   transition-all duration-500 ${className2}`} >
          {btnTitle}
        </span>
      </button>
    );
  };


  export const CartButton = ({ onClick=()=>{}, disabled=false }) => {
    const [isHoveringCartButton, setIsHoveringCartButton] = useState(false);
      return (
        <button onClick={onClick} disabled={disabled} className={`flex flex-row gap-[.3125vw] items-center justify-center shadow-[0px_.25vw_.3125vw_rgba(0,_0,_0,_0.4)]   rounded-[4vw]  ml-auto px-[2vw] py-[.75vw] transition-colors transform duration-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                 style={{backgroundColor:isHoveringCartButton && !disabled? "#f3e9d2":"darkslategrey"}} onMouseEnter={() => !disabled && setIsHoveringCartButton(true)} onMouseLeave={() => setIsHoveringCartButton(false)}>
                  <h5 className='text-h5Text font-dyeLine font-bold transition-colors transform duration-500' style={{color:isHoveringCartButton && !disabled?"black":"#f3e9d2"}}>Move To Cart</h5>
                  <div className='relative w-[2.25vw] h-[2.25vw]   items-center overflow-hidden '>
                  <svg className='absolute text-black my-auto mx-auto min-w-[2.25vw] min-h-[2.25vw] transition-all transform duration-500' width="2.25vw" height="2.25vw" viewBox="0 0 47 49" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{left:isHoveringCartButton?"-2.5vw":"0"}}>
                    <path d="M10.0006 24.5627H38.0006M38.0006 24.5627L24.0006 10.5627M38.0006 24.5627L24.0006 38.5627" stroke="#F3E9D2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <img src={cartImg} className='absolute w-[2.25vw] h-[2.25vw]  my-auto transition-all transform duration-500' style={{left:isHoveringCartButton?"0vw":"2.5vw"}}/>
                  </div>

                </button>
      )
  }

  export const ContactUsButton = ({ href, disabled=false }) => {
    const [isHoveringContactButton, setIsHoveringContactButton] = useState(false);
      return (
        <a href={disabled ? undefined : href} target="_blank" rel="noopener noreferrer"
           onClick={(e) => { if (disabled) e.preventDefault(); }}
           aria-disabled={disabled}
           className={`flex flex-row gap-[.3125vw] items-center justify-center shadow-[0px_.25vw_.3125vw_rgba(0,_0,_0,_0.4)] rounded-[4vw] ml-auto px-[2vw] py-[.75vw] transition-colors transform duration-700 ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                 style={{backgroundColor:isHoveringContactButton && !disabled? "#1EBE57":"#25D366"}} onMouseEnter={() => !disabled && setIsHoveringContactButton(true)} onMouseLeave={() => setIsHoveringContactButton(false)}>
                  <h5 className='text-h5Text font-dyeLine font-bold text-white'>Contact Us</h5>
                  <svg className='w-[2.25vw] h-[2.25vw]' viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12.004 2C6.477 2 2 6.477 2 12c0 1.986.583 3.833 1.588 5.383L2 22l4.766-1.55A9.94 9.94 0 0 0 12.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2zm0 18.19a8.17 8.17 0 0 1-4.166-1.14l-.299-.177-2.828.919.925-2.756-.194-.283A8.15 8.15 0 0 1 3.83 12c0-4.51 3.674-8.19 8.174-8.19 4.5 0 8.174 3.68 8.174 8.19 0 4.51-3.674 8.19-8.174 8.19z"/>
                  </svg>
                </a>
      )
  }
  export const TitleButton2 = ({ onClick={}, className = '',btnTitle,btnWidth, btnHeight,btnRadius,className2='',disabled=false, btnWidthPhone, btnHeightPhone, btnRadiusPhone }) => {
    const [isHovered, setIsHovered] = useState(false);
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
    return (
        <button
        onClick={onClick}
        className={`group text-white shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] transition-all duration-700 ease-in-out hover:bg-btnHoverColour ${className}`}
        style={(screenWidth ?? 0) > 768 ? {
          width: `${btnWidth}vw`,
          height: `${btnHeight}vw`,
          borderRadius: `${btnRadius}vw`
        } : {
          width: btnWidthPhone ? `${btnWidthPhone}vw` : '100%',
          height: btnHeightPhone ? `${btnHeightPhone}vw` : 'auto',
          borderRadius: btnRadiusPhone ? `${btnRadiusPhone}vw` : '0'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
      >
        <span className={`text-regularTextPhone md:text-regularText text-center font-roboto p-[.1vw]  ${isHovered?'text-black':'text-white'}   transition-all duration-500 ${className2}`} >
          {btnTitle}
        </span>
      </button>
    );
  };