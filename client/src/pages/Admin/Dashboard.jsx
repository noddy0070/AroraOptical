import React, { useRef,useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon2 from '../../assets/images/icons/SearchIcon.svg'
import { AnalyticsIcon,AttributesIcon,CancellationPolicyIcon,CategoryIcon,DashboardIcon,EcommerceIcon,FAQIcon,HelpCenterIcon,OrderIcon,PrivacyPolicyIcon,SettingsIcon,ShippingAndDeliveryIcon,TermsAndConditionIcon,UserIcon} from './Icons';
import ChatIcon from '../../assets/images/icons/chatIcon.svg'
import NotificationIcon from '../../assets/images/icons/notificationIcon.svg'
import logo from '../../assets/images/AroraOpticalLogo.png';

import './Dashboard.css';
import { TransitionLink } from '@/Routes/TransitionLink';
const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ecommerceSection=[
    {id:"Product List"},
    {id:"Add Product"},
  ]

  const categorySection=[
    {id:"Category List"},
    {id:"New Category"}
  ]

  const attributesSection=[
    {id:"Attributes"},
  ]

  const userSection=[
    {id:"User List"},
    {id:"Add User"},
  ]

  const orderSection=[
    {id:"Order List"},
  ]


  const homeSection = [
    {id:'Dashboard', path: ['/Admin/Dashboard'],icon:DashboardIcon ,subSections:[]},
    {id:'Analytics', path: ['/Admin/Dashboard'],icon:AnalyticsIcon ,subSections:[]},
    {id:'Ecommerce', path: ['/Admin/Dashboard/products','/Admin/Dashboard/add-product'],icon:EcommerceIcon,subSections:ecommerceSection},
    // {id:'Category', path: ['/Admin/Dashboard/add-product'],icon:CategoryIcon,subSections:categorySection},
    {id:'Attributes', path: ['/Admin/Dashboard/attributes'],icon:AttributesIcon,subSections:attributesSection},
    {id:'User', path: ['/Admin/Dashboard/user'],icon:UserIcon,subSections:userSection},
    {id:'Order', path: ['/Admin/Dashboard/analytics'],icon:OrderIcon,subSections:orderSection},
  ]

  const settingsSection = [
    {id:'Setting', path: ['/Admin/Dashboard/search'],icon:SettingsIcon,subSections:[]},
  ]

  const supportSection = [
    {id:'Help Center', path: ['/'],icon:HelpCenterIcon,subSections:[]},
    {id:'FAQs', path: ['/Admin/Dashboard/faqs'],icon:FAQIcon,subSections:[]},
    {id:'Privacy Policy', path: ['/Admin/Dashboard/terms'],icon:PrivacyPolicyIcon,subSections:[]},
    {id:'Shipping and Delivery', path: ['/Admin/Dashboard/contact'],icon:ShippingAndDeliveryIcon,subSections:[]},
    {id:'Cancellation Policy', path: ['/Admin/Dashboard/support'],icon:CancellationPolicyIcon,subSections:[]},
    {id:'Terms & Condition', path: ['/Admin/Dashboard/support'],icon:TermsAndConditionIcon,subSections:[]},
  ]

  const mainSections=[
    {id:'Home', subSections:homeSection   },
    {id:'Settings', subSections:settingsSection},
    {id:'Support', subSections:supportSection},
  ]

  const inputRef = useRef(null);
    const [search, setSearch] = useState('');
  
    const handleChange = () => {
      const value = inputRef.current.value; // Access the input value through the ref
      setSearch(value); // Update the state with the input value
      console.log(search);
    };
  
    const [activeSection1, setActiveSection1] = useState('Home');
    const [activeSection2, setActiveSection2] = useState('Dashboard');
    const [activeSection3, setActiveSection3] = useState('Null');
    
  return (
    <div className="flex flex-col">
    <div className='flex  w-full  ' >
    <div className=' w-[19vw] h-[6.7vw] rounded-[10vw]  flex items-center pl-[3vw] gap-[.5vw]' >
      <TransitionLink to='/'>
      <img src={logo} alt='logo' className='h-auto w-[3.75vw]' />
      </TransitionLink>
      <TransitionLink to='/'>
      <div className='leading-[130%] font-dyeLine'>
        <p className='text-[1.688vw] font-medium '>Arora</p>
        <p className='text-[1.25vw]'>Opticals</p>
      </div>
      </TransitionLink>
    </div>
    <div className='w-[81vw] h-[6.75vw] flex items-center justify-center gap-[12vw] ' style={{ boxShadow: '0px 18px 10px -10px rgba(0, 0, 0, 0.15)' }} >
      <div className=' flex flex-row gap-[2vw] md:gap-[.5vw]  w-[46.875vw]  items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]'>
                    <img className='w-[6vw] md:w-[1.75vw] h-[6vw]  md:h-[1.75vw]' src={SearchIcon2}/>
                    <input className=' focus:outline-none ' type="text" defaultValue="Search Here" ref={inputRef} onChange={handleChange} 
                    onFocus={(e) => {if (e.target.value === 'Search Here') {e.target.value = '';}}}
                    onBlur={(e) => { if (e.target.value.trim() === '') {e.target.value = 'Search Here';}}}/>
                  </div>
      <div className='flex gap-[2vw]'>
          <img className='w-[1.25vw] h-auto' src={NotificationIcon}/>
          <img className='w-[1.25vw] h-auto' src={ChatIcon}/>
          <div className='flex gap-[.75vw] items-center'>
            <div className='w-[2.5vw] h-[2.5vw] rounded-full bg-gray-500'/>
            <div className='flex flex-col font-roboto leading-[120%]'>
              <p className='text-regularText font-bold'>Name</p>
              <p className='text-tinyText'>Role</p>
            </div>
          </div>
      </div>
    </div>
      </div>
      <div className='flex '>
      {/* Sidebar */}
      <div className="w-[19vw]  min-h-screen  flex flex-col px-[2vw] gap-[5vw] "style={{ boxShadow: '20px 0px 10px -10px rgba(0, 0, 0, 0.15)' }}
      >
        
        <div className="flex flex-col gap-[1vw]">
          {mainSections.map(({ id, subSections }) => (
            <div key={id} className="flex flex-col " >
              <p className='font-dyeLine font-medium text-h6Text' style={{opacity: activeSection1==id?'1':'0.6'}}>{id}</p>
              {subSections.map((subSections1,index)=>
              <div key={subSections1.id} >
              <div className='font-roboto font-bold text-mediumText opacity-60 flex items-center' style={{opacity: activeSection2==subSections1.id?'1':'.6'}}>
                <div className='p-[.875vw] cursor-pointer' onClick={() => {setActiveSection1(id); setActiveSection2(subSections1.id); setActiveSection3(subSections1.subSections.length==0?'Null':subSections1.subSections[0].id); navigate(subSections1.path[0]) }}>
                {subSections1.icon()}
                </div>
                {<p className='cursor-pointer '  onClick={() => {setActiveSection1(id); setActiveSection2(subSections1.id); setActiveSection3(subSections1.subSections.length==0?'Null':subSections1.subSections[0].id);navigate(subSections1.path[0]) }}>{subSections1.id}</p>}
                {subSections1.subSections.length > 0 && 
                <div className={`ml-auto ${activeSection2==subSections1.id?'rotate-0':'rotate-180'} duration-300 transition-all ease-in-out cursor-pointer `} >
                <svg className='h-[1.5vw] w-[1.5vw]' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15L7 10H17L12 15Z" fill="#1D1B20"/>
                </svg>
              </div>
                }
              </div>
              {subSections1.subSections.length > 0 &&<ul className='list-disc list-inside '>
                {subSections1.subSections.map((subSections2,index) => (
                  <li key={subSections2.id} className={` ml-[2.75vw] items-center font-roboto pb-[.25vw] font-bold text-regularText cursor-pointer ${activeSection2==subSections1.id?"content show":"content"}`}
                  onClick={() => {setActiveSection1(id); setActiveSection2(subSections1.id); setActiveSection3(subSections2.id);navigate(subSections1.path[index]) }} style={{opacity: activeSection3==subSections2.id?'1':'0.6'}} >
                  {subSections2.id}
                  </li>
                ))}
                </ul>}
              </div>)}
              </div>

          ))}
        </div>
      </div>

      {/* Right Content Area - Outlet for nested routes */}
      <div className="w-[81vw] ">
        <Outlet /> {/* This will render the matched child route */}
      </div>
      </div>
    </div>
  );
};

export default DashBoard;
