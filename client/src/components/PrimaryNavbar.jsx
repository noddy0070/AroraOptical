import React from 'react';
import logo from '../assets/images/AroraOpticalLogo.png';
import { Link } from 'react-router-dom';

export default function PrimaryNavbar () {
    return (
      <nav className="w-full  ">
        <div className="flex flex-row  h-[4.5vw] justify-between items-center ">
          <div className='m-auto'>
                <Link to='/'>
                <img className='h-[2.625vw] w-[3.6875vw] m-auto' src={logo}/></Link>
                </div>
        </div>
      </nav>
    );
  };
  
  