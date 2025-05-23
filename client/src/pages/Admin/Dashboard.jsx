import React, { useRef,useState,useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon2 from '../../assets/images/icons/SearchIcon.svg'
import { AnalyticsIcon,AttributesIcon,CancellationPolicyIcon,CategoryIcon,DashboardIcon,EcommerceIcon,FAQIcon,HelpCenterIcon,OrderIcon,PrivacyPolicyIcon,SettingsIcon,ShippingAndDeliveryIcon,TermsAndConditionIcon,UserIcon} from './Icons';
import ChatIcon from '../../assets/images/icons/chatIcon.svg'
import NotificationIcon from '../../assets/images/icons/notificationIcon.svg'
import logo from '../../assets/images/AroraOpticalLogo.png';

import './Dashboard.css';
import { TransitionLink } from '@/Routes/TransitionLink';


const ecommerceSection = [
  { id: "Product List" },
  { id: "Add Product" },
];

const categorySection = [
  { id: "Category List" },
  { id: "New Category" }
];

const attributesSection = [
  { id: "Attributes" },
];

const userSection = [
  { id: "User List" },
  { id: "Add User" },
];

const orderSection = [
  { id: "Order List" },
];

const homeSection = [
  { id: 'Dashboard', path: ['/Admin'], icon: DashboardIcon, subSections: [] },
  { id: 'Analytics', path: ['/Admin'], icon: AnalyticsIcon, subSections: [] },
  { id: 'Ecommerce', path: ['/Admin/products', '/Admin/add-product'], icon: EcommerceIcon, subSections: ecommerceSection },
  { id: 'Attributes', path: ['/Admin/attributes'], icon: AttributesIcon, subSections: attributesSection },
  { id: 'User', path: ['/Admin/user', '/Admin/add-user'], icon: UserIcon, subSections: userSection },
  { id: 'Order', path: ['/Admin/analytics'], icon: OrderIcon, subSections: orderSection },
];

const settingsSection = [
  { id: 'Setting', path: ['/Admin/search'], icon: SettingsIcon, subSections: [] },
];

const supportSection = [
  { id: 'Help Center', path: ['/'], icon: HelpCenterIcon, subSections: [] },
  { id: 'FAQs', path: ['/Admin/faqs'], icon: FAQIcon, subSections: [] },
  { id: 'Privacy Policy', path: ['/Admin/privacy-policy'], icon: PrivacyPolicyIcon, subSections: [] },
  { id: 'Shipping and Delivery', path: ['/Admin/shipping-policy'], icon: ShippingAndDeliveryIcon, subSections: [] },
  { id: 'Cancellation Policy', path: ['/Admin/cancellation-policy'], icon: CancellationPolicyIcon, subSections: [] },
];

const mainSections = [
  { id: 'Home', subSections: homeSection },
  { id: 'Settings', subSections: settingsSection },
  { id: 'Support', subSections: supportSection },
];


const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');

  const getActiveSections = () => {
    for (const main of mainSections) {
      for (const sub of main.subSections) {
        if (sub.path.includes(location.pathname)) {
          const subIndex = sub.path.indexOf(location.pathname);
          const subSub = sub.subSections.length ? sub.subSections[subIndex]?.id : 'Null';
          return {
            section1: main.id,
            section2: sub.id,
            section3: subSub
          };
        }
      }
    }
    return { section1: '', section2: '', section3: 'Null' };
  };

  const [active, setActive] = useState(getActiveSections());

  useEffect(() => {
    setActive(getActiveSections());
  }, [location.pathname]);

  const handleChange = () => {
    const value = inputRef.current.value;
    setSearch(value);
    console.log(value);
  };

  return (
    <div className="flex flex-col">
      <div className='flex w-full'>
        <div className='w-[19vw] h-[6.7vw] flex items-center pl-[3vw] gap-[.5vw]' >
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
        <div className='w-[81vw] h-[6.75vw] flex items-center justify-center gap-[12vw]'>
          <div className='flex flex-row gap-[2vw] w-[46.875vw] items-center text-gray-600 font-roboto font-bold text-[14px] h-[3vw] px-[.75vw] rounded-[2.5vw] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)] border-[1px]'>
            <img className='w-[1.75vw] h-[1.75vw]' src={SearchIcon2} />
            <input
              className='focus:outline-none'
              type="text"
              defaultValue="Search Here"
              ref={inputRef}
              onChange={handleChange}
              onFocus={(e) => { if (e.target.value === 'Search Here') e.target.value = ''; }}
              onBlur={(e) => { if (e.target.value.trim() === '') e.target.value = 'Search Here'; }}
            />
          </div>
          <div className='flex gap-[2vw]'>
            <img className='w-[1.25vw] h-auto' src={NotificationIcon} />
            <img className='w-[1.25vw] h-auto' src={ChatIcon} />
            <div className='flex gap-[.75vw] items-center'>
              <div className='w-[2.5vw] h-[2.5vw] rounded-full bg-gray-500' />
              <div className='flex flex-col font-roboto leading-[120%]'>
                <p className='text-regularText font-bold'>Name</p>
                <p className='text-tinyText'>Role</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className='flex'>
        <div className="w-[19vw] min-h-screen flex flex-col px-[2vw] gap-[5vw]" >
          <div className="flex flex-col gap-[1vw]">
            {mainSections.map(({ id, subSections }) => (
              <div key={id} className="flex flex-col">
                <p className='font-dyeLine font-medium text-h6Text' style={{ opacity: active.section1 === id ? '1' : '0.6' }}>{id}</p>
                {subSections.map((sub, idx) => (
                  <div key={sub.id}>
                    <div className='font-roboto font-bold text-mediumText flex items-center' style={{ opacity: active.section2 === sub.id ? '1' : '0.6' }}>
                      <div className='p-[.875vw] cursor-pointer' onClick={() => navigate(sub.path[0])}>
                        {sub.icon()}
                      </div>
                      <p className='cursor-pointer' onClick={() => navigate(sub.path[0])}>{sub.id}</p>
                      {sub.subSections.length > 0 && (
                        <div className={`ml-auto ${active.section2 === sub.id ? 'rotate-0' : 'rotate-180'} duration-300 transition-all ease-in-out cursor-pointer`}>
                          <svg className='h-[1.5vw] w-[1.5vw]' viewBox="0 0 24 24" fill="none">
                            <path d="M12 15L7 10H17L12 15Z" fill="#1D1B20" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {sub.subSections.length > 0 && (
                      <ul className='list-disc list-inside'>
                        {sub.subSections.map((subSub, subIdx) => (
                          <li
                            key={subSub.id}
                            className={`ml-[2.75vw] font-roboto pb-[.25vw] font-bold text-regularText cursor-pointer`}
                            style={{ opacity: active.section3 === subSub.id ? '1' : '0.6' }}
                            onClick={() => navigate(sub.path[subIdx])}
                          >
                            {subSub.id}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="w-[81vw] " style={{
     background: `
      linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,1) 2%, rgba(255,255,255,1) 98%, rgba(0,0,0,0.15) 100%),
      linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,1) 2%, rgba(255,255,255,1) 98%, rgba(0,0,0,0.15) 100%)
    `,
    backgroundBlendMode: 'darken'
  }}>
        <Outlet /> {/* This will render the matched child route */}
      </div>
      </div>
    </div>
  );
};

export default DashBoard;
