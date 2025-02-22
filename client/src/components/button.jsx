import React,{useState} from 'react';
import ArrowNorthEast from "../assets/images/ArrowNorthEast.png";
import cartImg from '../assets/images/lensPage/cart.png';
export const IconButton = ({ onClick = () => {}, className = '', iconWidth, btnSize,padding }) => {
    return (
        <button
        onClick={()=>{onClick}}
            style={{
                width: `${btnSize}vw`,
                height: `${btnSize}vw`,
                padding: `${padding}vw`,
            }}
            className={`bg-darkslategrey shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] text-[#F4F5F9] hover:text-black transition-all duration-700 ease-in-out hover:bg-btnHoverColour flex justify-center items-center rounded-full  ${className}`}
        >
            <svg width={`${iconWidth}vw`} className=' ' viewBox="0 0 30 29" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.4634 2.33649C29.4867 1.75218 29.032 1.25956 28.4477 1.23619L18.9259 0.855319C18.3416 0.831947 17.849 1.28667 17.8256 1.87098C17.8022 2.45528 18.257 2.9479 18.8413 2.97127L27.3051 3.30983L26.9665 11.7736C26.9432 12.358 27.3979 12.8506 27.9822 12.8739C28.5665 12.8973 29.0591 12.4426 29.0825 11.8583L29.4634 2.33649ZM1.59416 28.484L29.1236 3.0722L27.6872 1.51614L0.157798 26.9279L1.59416 28.484Z"/>
            </svg>

        </button>
    );
};

  
  export const TitleButton = ({ onClick={}, className = '',btnTitle,btnWidth, btnHeight,btnRadius,className2='' }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
        onClick={()=>{onClick}}
        className={`group bg-darkslategrey text-white shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] transition-all duration-700 ease-in-out hover:bg-btnHoverColour ${className}`}
        style={{
          width: `${btnWidth}vw`,
          height: `${btnHeight}vw`,
          borderRadius: `${btnRadius}vw`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`text-regularText text-center font-roboto p-[.1vw]  ${isHovered?'text-black':'text-white'}   transition-all duration-500 ${className2}`} >
          {btnTitle}
        </span>
      </button>
    );
  };


  export const CartButton = ({ onClick=()=>{} }) => {
    const [isHoveringCartButton, setIsHoveringCartButton] = useState(false);
      return (
        <button onClick={onClick} className='flex flex-row gap-[.3125vw] items-center justify-center shadow-[0px_.25vw_.3125vw_rgba(0,_0,_0,_0.4)]   rounded-[4vw]  ml-auto px-[2vw] py-[.75vw] transition-colors transform duration-700'
                 style={{backgroundColor:isHoveringCartButton? "#f3e9d2":"darkslategrey"}} onMouseEnter={() => setIsHoveringCartButton(true)} onMouseLeave={() => setIsHoveringCartButton(false)}>
                  <h5 className='text-h5Text font-dyeLine font-bold transition-colors transform duration-500' style={{color:isHoveringCartButton?"black":"#f3e9d2"}}>Move To Cart</h5>
                  <div className='relative w-[2.25vw] h-[2.25vw]   items-center overflow-hidden '>
                  <svg className='absolute text-black my-auto mx-auto min-w-[2.25vw] min-h-[2.25vw] transition-all transform duration-500' width="2.25vw" height="2.25vw" viewBox="0 0 47 49" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{left:isHoveringCartButton?"-2.5vw":"0"}}>
                    <path d="M10.0006 24.5627H38.0006M38.0006 24.5627L24.0006 10.5627M38.0006 24.5627L24.0006 38.5627" stroke="#F3E9D2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <img src={cartImg} className='absolute w-[2.25vw] h-[2.25vw]  my-auto transition-all transform duration-500' style={{left:isHoveringCartButton?"0vw":"2.5vw"}}/>
                  </div>
                  
                </button>
      )
  }
  export const TitleButton2 = ({ onClick={}, className = '',btnTitle,btnWidth, btnHeight,btnRadius,className2='' }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
        onClick={()=>{onClick}}
        className={`group text-white shadow-[0px_.25vw_.375vw_rgba(0,_0,_0,_0.4)] transition-all duration-700 ease-in-out hover:bg-btnHoverColour ${className}`}
        style={{
          width: `${btnWidth}vw`,
          height: `${btnHeight}vw`,
          borderRadius: `${btnRadius}vw`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`text-regularText text-center font-roboto p-[.1vw]  ${isHovered?'text-black':'text-white'}   transition-all duration-500 ${className2}`} >
          {btnTitle}
        </span>
      </button>
    );
  };