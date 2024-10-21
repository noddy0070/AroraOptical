import React from 'react';
import {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { signInFail,signInSuccess,signInStart } from '../../redux/slice/userSlice';

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
       <div className='m-8'>
        <h1 className='text-3xl text-center font-semibold '>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center'>
            <input className='border p-3 rounded-lg' id='email' type="email" placeholder="Email" onChange={handleChange}/>
            <input className='border p-3 rounded-lg' id='password' type="password" placeholder="Password" onChange={handleChange}/>
            <button disabled={loading} className='border p-3 rounded-lg'  type="submit">{loading?"loading":"Sign Up"}</button>
        </form>
        {error && <p className='text-red-500'>{error}</p>}
        <div>
            <p>Don't have an account?</p>
            <Link to='/signup'>
            <span className='text-blue-500'> SignUp</span>
            </Link>
        </div>
       </div>
    );
};
