import React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
export default function SignUp(){
    const [formData,setFormData]=useState({});
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    console.log(formData);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);

        try{
            const res = await axios.post(`http://localhost:3000/api/auth/signup`, formData, {
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
            
        }catch(error){
            setError(error.message);
            setLoading(false);
        }
        
        
    }
    
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    return (
       <div className='m-8'>
        <h1 className='text-3xl text-center font-semibold '>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center'>
            <input className='border p-3 rounded-lg' id='username'  type="text" placeholder="Username" onChange={handleChange}/>
            <input className='border p-3 rounded-lg' id='email' type="email" placeholder="Email" onChange={handleChange}/>
            <input className='border p-3 rounded-lg' id='password' type="password" placeholder="Password" onChange={handleChange}/>
            <button disabled={loading} className='border p-3 rounded-lg'  type="submit">{loading?"loading":"Sign Up"}</button>
            
        </form>
        {error && <p className='text-red-500'>{error}</p>}
        <div>
            <p>Have an account?</p>
            <Link to='/signin'>
            <span className='text-blue-500'> SignIn</span>
            </Link>
        </div>
       </div>
    );
};
