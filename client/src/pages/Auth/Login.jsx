import React,{useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/slice/authSlice';
import axios from "axios";
import LoginImg from '../../assets/images/LoginImg.png'
import google from '../../assets/images/Google.png';
import { TransitionLink } from '../../Routes/TransitionLink';
import { baseURL } from '@/url';

export default function Login(){
    const [formData,setFormData]=useState({});
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);
    const {user} =useSelector((state)=>state.auth);

    console.log(formData);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const res = await axios.post(`${baseURL}/api/auth/signin`, formData, {
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data=await res.data;
            console.log(data);
            
            if(data.success===false){
                setError("Invalid Credentials");
                setLoading(false);
                return;
            }
            setError('');
            dispatch(loginSuccess({ user: res.data.message }))
            navigate('/');            
        }catch(error){
            setError("Invalid Credentials");
            console.log(error);
        }
        setLoading(false);
        
    }


    // const handleGoogleBtn=async(e)=>{
    //     setLoading(true);
    //     try{
    //         const res = await axios.get(`${baseURL}/api/auth/google`, formData, {
    //             withCredentials:true,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         const data=await res.data;
    //         console.log(data);
            
    //         if(data.success===false){
    //             setError("Invalid Credentials");
    //             setLoading(false);
    //             return;
    //         }
    //         setError('');
    //         dispatch(loginSuccess({ user: res.data.user }));
    //         navigate('/');
            
    //     }catch(error){
    //         setError("Invalid Credentials");
    //         console.log(error);
    //     }
    //     setLoading(false);
        
    // }
    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }
    console.log(formData)
    
    return (
       <div className='flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]'>
            <div className='px-[4.5vw] md:px-[4vw] w-full  md:w-[47.375vw] md:max-w-[762px] '>
                <div className='flex flex-col   h-full '>
                {/* <TransitionLink to='/' >
                    <img className='cursor-pointer w-[3.6875vw] h-[2.625vw]' src={aroraOpticalLogo}/></TransitionLink> */}
                    <div className='w-full mx-auto '>
                        <h3 className='font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold'>
                            Login
                        </h3>
                        <p className='font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]'>
                            Login to your own world of eyewear
                        </p>
                        <div className='flex flex-col gap-[4vw] md:gap-[1.5vw]'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText'>
                            <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='email' type="email" placeholder="Email" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='password' type="text" placeholder="Password" onChange={handleChange}/>
                            <button disabled={loading}  className='border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white' onClick={handleSubmit}  >{loading?"Loading...":"Login"}</button>
                        </form>
                        <div className="w-full my-[0] relative border-black border-t-[1px] border-solid box-border h-[2px]" />

                        <a href={`${baseURL}/api/auth/google`} className='flex flex-row justify-center shadow-[0px_.125vw_.625vw_rgba(0,_0,_0,_0.25)] items-center rounded-[8vw] md:rounded-[2vw]'>
                        <button disabled={loading} className='flex flex-row justify-center   items-center gap-[4px] md:gap-[.5vw] text-regularTextPhone md:text-regularText p-[2vw] md:p-[.75vw] rounded-[8vw] md:rounded-[2vw]'>
                            <img src={google} className='h-[5vw] w-[5vw] md:h-[1.5vw] md:w-[1.5vw]'/><p >Sign in with Google</p>
                        </button>
                           </a> 
                        {error && <p className='text-red-500'>{error}</p>}
                            <div className='font-roboto text-regularTextPhone md:text-regularText '>
                            <p className='text-center leading-[150%]'>Don't have an account? <TransitionLink to='/signup' ><span className='underline'>SignUp</span></TransitionLink> | <span className='underline'> <TransitionLink to='/' >Home</TransitionLink></span></p>
                        </div>
                        </div>

                        
                    </div>
                </div>
            
            </div>
            <div className='w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden'>
                <img className='h-full w-full' src={LoginImg}></img>
            </div>        
       </div>
    );
};
