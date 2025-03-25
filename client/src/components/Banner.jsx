import React,{useState} from 'react';

export default function Banner() {
    const [show,setShow]=useState(true)
    return (
        <div className="absolute  z-[1] top-0 left-0 bg-darkslategrey px-[6.75vw] py-[1.25vw] md:px-[5vw] md:py-[.75vw] w-full transition-transform duration-1000 ease-linear" style={{scale:show?1:0}}>
            <div className="relative w-full h-full">
                <div className="flex flex-row font-roboto items-center text-white text-[8px] md:text-regularText justify-center h-full gap-[1.5vw]">
                    <div className="flex flex-row gap-[3.75vw] md:gap-[1.5vw] w-full justify-center">
                    <p className="leading-[150%]">
                        <span className="text-[12px] md:font-medium leading-[100%]">
                        Medium Length banner heading goes here</span><br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <button className="text-[10px] px-[3vw] md:px-[1.25vw] py-[1.25vw] md:py-[.5vw] bg-black rounded-[5.5vw] md:rounded-[2.3125vw]">
                        Buy Now
                    </button>
                    </div>
                    <div className=" transform transition-transform duration-300 cursor-pointer" onClick={()=>setShow(false)} style={{transform: 'rotate(0deg)'}} >
              <svg xmlns="http://www.w3.org/2000/svg"  className="w-[5vw] h-[5vw] md:w-[1.75vw] md:h-[1.75vw]"  color='black'
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
                    
                </div>

                
            </div>
        </div>
    )
}