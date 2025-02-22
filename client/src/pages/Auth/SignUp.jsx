import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import React from 'react';
import aroraOpticalLogo from '../../assets/images/AroraOpticalLogo.png';
import LoginImg from '../../assets/images/LoginImg.png'
import { TransitionLink } from '../../Routes/TransitionLink';


export default function SignUp(){
    const [formData,setFormData]=useState({});
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate=useNavigate();

    console.log(formData);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);

        try{
            const res = await axios.post(`http://localhost:3000/api/auth/sendOTP`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data=await res.data;
            
            if(data.success===false){
                setError(data.message);
                setLoading(false);
                return;
            }
            setError(null);
            setLoading(false);
            setStep(2);
        }catch(error){
            setError(error.message);
            setLoading(false);
        }
        
    }

    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

   
    
    console.log(formData.number);

    return (
       <div className='p-[4vw]'>
        <div className='flex flex-row  h-[48.4375vw]'>
            <div className='px-[4vw]  w-[47.375vw]'>
                <div className='flex flex-col   h-full    gap-[3vw]'>
                <TransitionLink to='/' >
                    <img className='cursor-pointer w-[3.6875vw] h-[2.625vw]' src={aroraOpticalLogo}/></TransitionLink>
                    {step==1?<div className='h-[37.1875vw] w-[30vw] mx-auto '>
                        <h3 className='font-dyeLine text-[2.5vw] text-center mb-[1.5vw] font-bold'>
                            Sign Up
                        </h3>
                        <p className='font-roboto text-[1.125vw] text-center leading-[150%] mb-[2vw]'>
                            Login to your own world of eyewear
                        </p>
                        <div className='flex flex-col gap-[1.5vw]'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[1vw] justify-center font-roboto text-regularText'>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='name' type="text" placeholder="Name" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='name' type="email" placeholder="Email" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='state' type="text" placeholder="State" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='city' type="text" placeholder="City" onChange={handleChange}/>
                            
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='password' type="text" placeholder="Password" onChange={handleChange}/>
                        </form>
                        <button disabled={loading} className='border p-[.75vw] h-[vw] rounded-[2vw] bg-black text-white' onClick={handleSubmit}  >{loading?"loading":"Next"}</button>
                            <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[0.063vw]" />
                         
                        {error && <p className='text-red-500'>{error}</p>}
                            <div className='font-roboto text-[1rem] '>
                                <p className='text-center leading-[150%]'>Already have an account? <TransitionLink to='/signin' ><span className='underline'>SignIn</span></TransitionLink></p>
                            </div>
                        </div>

                       
                    </div>:
                    <div className='h-[37.1875vw] w-[30vw] mx-auto'>
                        <h3 className='font-dyeLine text-[2.5vw] text-center mb-[1.5vw] font-bold'>
                            Verify OTP
                        </h3>
                        <p className='font-roboto text-[1.125vw] text-center leading-[150%] mb-[2vw]'>
                            Login to your own world of eyewear
                        </p>
                        <div className='flex flex-col gap-[1.5vw]'>
                        <form onSubmit={verifyOTP} className='flex flex-col gap-[1vw] justify-center font-roboto text-[1rem]'>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='otp' placeholder="otp" onChange={handleChange}/>
                            
                        </form>
                        <button disabled={loading} className='border p-[.75vw] h-[vw] rounded-[2vw] bg-black text-white' onClick={verifyOTP}  >{loading?"loading":"Send OTP"}</button>
                            <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[0.063vw]" />
                         
                        {error && <p className='text-red-500'>{error}</p>}
                            <div className='font-roboto text-[1rem] '>
                                <p className='text-center leading-[150%]'>Already have an account? <TransitionLink to='/signin' ><span className='underline'>SignIn</span></TransitionLink></p>
                            </div>
                        </div>

                        </div>}
                </div>
            
            </div>
            <div className='w-[44.625vw] h-full rounded-[1.25vw] overflow-hidden'>
                <img className='h-full w-full' src={LoginImg}></img>
            </div>

        </div>
        
        
       </div>
    );
};
