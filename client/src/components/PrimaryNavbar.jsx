import React from 'react';
import logo from '../assets/images/AroraOpticalLogo.png';

export default function PrimaryNavbar () {
    return (
      <nav className="w-full  ">
        <div className="flex flex-row  h-[4.5vw] justify-between items-center ">
                <img className='h-[2.625vw] w-[3.6875vw] m-auto' src={logo}/>
        </div>
      </nav>
    );
  };
  
  