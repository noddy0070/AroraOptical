import React from 'react';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { signInFail,signInSuccess,signInStart } from '../../redux/slice/userSlice';
import aroraOpticalLogo from '../../assets/images/AroraOpticalLogo.png';
import LoginImg from '../../assets/images/LoginImg.png'
import google from '../../assets/images/Google.png';
import { TransitionLink } from '../../Routes/TransitionLink';

export default function SignIn(){
    const [formData,setFormData]=useState({});
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {error,loading}=useSelector((state)=>state.user);

    console.log(formData);
    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            dispatch(signInStart());
            const res = await axios.post(`http://localhost:3000/api/auth/signin`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data=await res.data;
            
            if(data.success===false){
                dispatch(signInFail(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
            
        }catch(error){
            dispatch(signInFail(error.message));
        }
        
        
    }
    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    
    return (
       <div className='p-[4vw]'>
        <div className='flex flex-row  h-[48.4375vw]'>
                <div className='px-[4vw]  w-[47.375vw]'>
                                <div className='flex flex-col   h-full  justify-center  gap-[3vw]'>
                                <TransitionLink to='/' >
                                    <img className='cursor-pointer w-[3.6875vw] h-[2.625vw]' src={aroraOpticalLogo}/></TransitionLink>
                                    <div className='h-[37.1875vw] w-[30vw] mx-auto '>
                                        <h3 className='font-dyeLine text-[2.5vw] text-center mb-[1.5vw] font-bold'>
                                            Login
                                        </h3>
                                        <p className='font-roboto text-[1.125vw] text-center leading-[150%] mb-[2vw]'>
                                            Login to your own world of eyewear
                                        </p>
                                        <div className='flex flex-col gap-[1.5vw]'>
                                        <form onSubmit={handleSubmit} className='flex flex-col gap-[1vw] justify-center font-roboto text-[1rem]'>
                                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='email' type="email" placeholder="Email" onChange={handleChange}/>
                                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='password' type="text" placeholder="Password" onChange={handleChange}/>
                                            <button disabled={loading} className='border p-[.75vw]  h-[3vw] rounded-[2vw] bg-black text-white' onClick={handleSubmit}  >{loading?"loading":"Login"}</button>
                                        <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border " />
                                        </form>
                                        <div className='flex flex-row justify-center cursor-pointer shadow-[0px_.125vw_.625vw_rgba(0,_0,_0,_0.25)] items-center gap-[.5vw] py-[.75vw] px-[1.5vw] rounded-[2vw]'><img src={google} className='h-[1.5vw] w-[1.5vw]'/><p className='text-regularText'>Sign in with Google</p></div>
                                         
                                        {error && <p className='text-red-500'>{error}</p>}
                                            <div className='font-roboto text-[1rem] '>
                                                <p className='text-center leading-[150%]'>Don't have an account? <TransitionLink to='/signup' ><span className='underline'>SignUp</span></TransitionLink></p>
                                            </div>
                                        </div>
                
                                       
                                    </div>
                                    </div>
            
            </div>
            <div className='w-[44.625vw] h-full rounded-[1.25vw] overflow-hidden'>
                <img className='h-full w-full' src={LoginImg}></img>
            </div>

        </div>
        
       </div>
    );
};
