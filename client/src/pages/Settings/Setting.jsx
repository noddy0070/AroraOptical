import React,{useState} from 'react';
import OrderIcon from '../../assets/images/icons/Orders.svg';
import LogOutIcon from '../../assets/images/icons/LogOut.svg';
import ProfileIcon from '../../assets/images/icons/Profile.svg';
import WishlistIcon from '../../assets/images/icons/Wishlist2.svg';
import ProfilePic from '../../assets/images/icons/ProfilePic.png';
import { useSelector } from 'react-redux';
import Profile from './Profile';
import WishList from './Wishlist';
import Orders from './Orders';
export default function Settings(){
    const [activeTab, setActiveTab] = useState('profile');
    
    const {user} =useSelector((state)=>state.auth);
    const tabs = {
            "profile": <Profile user={user}/>,
            "orders": <Orders/>,
            "wishlist": <WishList/>
        }
    
    return (    
        <div className='m-[2vw] font-roboto'>
            <div className='flex flex-row gap-[1.25vw] justify-center'>
                <div className='w-[25.125vw] flex flex-col gap-[1.875vw] px-[.75vw]'>
                    <div className='w-full items-center flex flex-row gap-[1.5vw]'>
                        <img src={ProfilePic} className='w-[3vw] h-[3vw]'></img>
                        <h5 className='text-h5Text font-dyeLine font-bold'>Hey, Utkarsh</h5>
                    </div>
                    <div  onClick={()=>setActiveTab('profile')} className='w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center'>
                        <img src={ProfileIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Profile</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw] ' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div  onClick={()=>setActiveTab('orders')} className='w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center'>
                        <img src={OrderIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Orders</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw] ' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div onClick={()=>setActiveTab('wishlist')} className='w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center'>
                        <img src={WishlistIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Wishlist</h6>
                        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto w-[1vw] h-[.8vw] ' width="100%" height="100%" viewBox="0 0 10 16" fill="#FFFFFF">
                            <path  fill="#000000" fillRule="evenodd" clipRule="evenodd" d="M9.79184 7.49475C10.0701 7.77382 10.0701 8.2262 9.79184 8.50527L2.52855 15.7907C2.25033 16.0698 1.79933 16.0698 1.52111 15.7907L1.18523 15.4538C0.907007 15.1748 0.907007 14.7223 1.18523 14.4433L7.60891 8.00001L1.18523 1.55673C0.907007 1.27766 0.907007 0.825275 1.18523 0.546206L1.52111 0.209302C1.79933 -0.069767 2.25033 -0.069767 2.52855 0.209302L9.79184 7.49475Z"/>
                        </svg>
                    </div>
                    <div className='w-[10.875vw] cursor-pointer flex flex-row gap-[.5vw] items-center'>
                        <img src={LogOutIcon} className='w-[1.625vw] h-[1.625vw]'></img>
                        <h6 className='text-h6Text font-roboto font-bold'>Logout</h6>
                        
                    </div>
                </div>
                <div className='w-[61.5625vw] flex flex-col gap-[1.5vw] px-[.75vw] py-[.875vw]'>
                {tabs[activeTab]}

                </div>
                
            </div>
        </div>
    );
};
