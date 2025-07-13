import React from 'react';
import logo from '../assets/images/AroraOpticalLogo.png';
import { TransitionLink } from '../Routes/TransitionLink';

export default function PrimaryNavbar () {
    return (
      <nav className="w-full hidden md:block bg-offwhitebg ">
        <div className="flex flex-row  h-[4.5vw] justify-between items-center ">
          <div className='m-auto'>
                <TransitionLink to='/'>
                <img className='h-[2.625vw] w-[3.6875vw] m-auto' src={logo}/></TransitionLink>
                </div>
        </div>
      </nav>
    );  
  };
  
  