import React from 'react';
import {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { signInFail,signInSuccess,signInStart } from '../../redux/slice/userSlice';
import placeholder from '../../assets/images/CategoryPlaceholder.png';
import aroraOpticalLogo from '../../assets/images/AroraOpticalLogo.png';
import phone from '../../assets/images/Phone.png';
import google from '../../assets/images/Google.png';

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
                                <Link to='/' >
                                    <img className='cursor-pointer w-[3.6875vw] h-[2.625vw]' src={aroraOpticalLogo}/></Link>
                                    <div className='h-[37.1875vw] w-[30vw] mx-auto '>
                                        <h3 className='font-dyeLine text-[2.5vw] text-center mb-[1.5vw] font-bold'>
                                            Login
                                        </h3>
                                        <p className='font-roboto text-[1.125vw] text-center leading-[150%] mb-[2vw]'>
                                            Login to your own world of eyewear
                                        </p>
                                        <div className='flex flex-col gap-[1.5vw]'>
                                        <form onSubmit={handleSubmit} className='flex flex-col gap-[1vw] justify-center font-roboto text-[1rem]'>
                                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='name' type="text" placeholder="Name" onChange={handleChange}/>
                                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='surname' type="text" placeholder="Surname" onChange={handleChange}/>
                                            {/* <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='Surname' type="text" placeholder="Surname" onChange={handleChange}/> */}
                                            {/* <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='Surname' type="text" placeholder="Surname" onChange={handleChange}/> */}
                
                                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='number' placeholder="Phone Number" onChange={handleChange}/>
                                            
                                        </form>
                                        <button disabled={loading} className='border p-[.75vw] h-[vw] rounded-[2vw] bg-black text-white' onClick={handleSubmit}  >{loading?"loading":"Send OTP"}</button>
                                            <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[0.063vw]" />
                                         
                                        {error && <p className='text-red-500'>{error}</p>}
                                            <div className='font-roboto text-[1rem] '>
                                                <p className='text-center leading-[150%]'>Don't have an account? <Link to='/signup' ><span className='underline'>SignUp</span></Link></p>
                                            </div>
                                        </div>
                
                                       
                                    </div>
                                    </div>
            
            </div>
            <div className='w-[44.625vw] h-full rounded-[1.25vw] overflow-hidden'>
                <img className='h-full w-full' src={placeholder}></img>
            </div>

        </div>
        
       </div>
    );
};
