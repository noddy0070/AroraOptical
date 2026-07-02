import React,{useState} from 'react';
import OrderIcon from '../../assets/images/icons/Orders.svg';
import LogOutIcon from '../../assets/images/icons/LogOut.svg';
import ProfileIcon from '../../assets/images/icons/Profile.svg';
import WishlistIcon from '../../assets/images/icons/Wishlist2.svg';
import ProfilePic from '../../assets/images/icons/ProfilePic.png';
import EyeTests from './EyeTests.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Profile from './Profile';
import WishList from './Wishlist';
import Orders from './Orders';
import Prescriptions from './Prescriptions';
import Addresses from './Addresses';
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router';
import { logout } from '@/redux/slice/authSlice';
import { toTitleCase } from '../../../shared/pipes/strFormatting';
export default function Settings(){
    const [activeTab, setActiveTab] = useState('profile');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);
    
    const {user} =useSelector((state)=>state.auth);
    const tabs = {
            "profile": <Profile user={user}/>,
            "orders": <Orders/>,
            "wishlist": <WishList/>,
            "prescriptions": <Prescriptions/>,
            "addresses": <Addresses/>,
            "eyeTests": <EyeTests/>
        }
    const handleLogOut=async ()=>{
        setLoading(true);
        try{
            const res=await api.post('/api/auth/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if(!res.data.success){
                setError("Unable to Logout");
                setLoading(false);
                return;
            }
            setError('');
            dispatch(logout());
            navigate('/');
        }catch(e){
            setError("Unable to Logout");
            console.log(e);
        }
        setLoading(false);
    }
    
    return (    
        <div className='m-[5vw] md:m-[2vw] font-roboto'>
            <div className='flex flex-col md:flex-row gap-[6vw] md:gap-[1.25vw] justify-center'>
                {/* Mobile Dropdown */}
                <div className='w-full md:hidden flex flex-col gap-[4vw]'>
                    <div className='w-full items-center flex flex-row gap-[4vw]'>
                        <img src={ProfilePic} className='w-[12vw] h-[12vw]'></img>
                        <h5 className='text-h5TextPhone font-dyeLine font-bold'>Hey, {toTitleCase(user?.name?.split(' ')[0]) || 'User'}</h5>
                    </div>
                    <div className='relative w-full'>
                        <select 
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className='w-full p-[3vw] text-regularTextPhone appearance-none border-black border-[1px] rounded-[10vw] focus:outline-none cursor-pointer'
                        >
                            <option value="profile">Profile</option>
                            <option value="orders">Orders</option>
                            <option value="wishlist">Wishlist</option>
                            <option value="prescriptions">Prescriptions</option>
                            <option value="addresses">Addresses</option>
                            <option value="eyeTests">Scheduled Eye Tests</option>
                        </select>
                        <div className="pointer-events-none absolute right-[4vw] top-1/2 -translate-y-1/2">
                            <svg className="w-[4vw] h-[4vw] text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogOut} 
                        className='w-full cursor-pointer flex flex-row gap-[2vw] items-center justify-center p-[3vw] border-black border-[1px] rounded-[10vw]'
                    >
                        <img src={LogOutIcon} className='w-[6.5vw] h-[6.5vw]'></img>
                        <h6 className='text-h6TextPhone font-roboto font-bold'>Logout</h6>
                    </button>
                </div>

                {/* Desktop Sidebar */}
                <div className='hidden md:flex md:w-[25.125vw] md:flex-col md:gap-[1.875vw] md:px-[.75vw]'>
                    <div className='w-full items-center flex flex-row gap-[1.5vw]'>
                        <img src={ProfilePic} className='w-[3vw] h-[3vw]'></img>
                        <h5 className='text-h5Text font-dyeLine font-bold'>Hey, {toTitleCase(user?.name?.split(' ')[0]) || 'User'}</h5>
                    </div>
                    <div  onClick={()=>setActiveTab('profile')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='profile'?"text-[#030972]":"text-black"}`}>
                        <img src={ProfileIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Profile</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div  onClick={()=>setActiveTab('orders')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='orders'?"text-[#030972]":"text-black"}`}>
                        <img src={OrderIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Orders</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div onClick={()=>setActiveTab('wishlist')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='wishlist'?"text-[#030972]":"text-black"}`}>
                        <img src={WishlistIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Wishlist</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div onClick={()=>setActiveTab('prescriptions')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='prescriptions'?"text-[#030972]":"text-black"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-[1.625vw] h-[1.625vw]' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h6 className='text-h6Text font-roboto font-bold'>Prescriptions</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div onClick={()=>setActiveTab('addresses')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='addresses'?"text-[#030972]":"text-black"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-[1.625vw] h-[1.625vw]' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h6 className='text-h6Text font-roboto font-bold'>Addresses</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div onClick={()=>setActiveTab('eyeTests')} className={`w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center ${activeTab=='eyeTests'?"text-[#030972]":"text-black"}`}>
                        <img src={WishlistIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Scheduled Eye Tests</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw]' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <button onClick={handleLogOut} className='w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center'>
                        <img src={LogOutIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Logout</h6>
                    </button>
                </div>
                <div className='w-full md:w-[61.5625vw] flex flex-col gap-[6vw] md:gap-[1.5vw] bg-white border border-gray-200 rounded-[4vw] md:rounded-2xl shadow-sm px-[5vw] md:px-[2vw] py-[6vw] md:py-[2vw]'>
                {tabs[activeTab]}
                </div>
                
            </div>
        </div>
    );
};
