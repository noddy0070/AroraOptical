import {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LoginImg from '../../assets/images/LoginImg.png'
import { TransitionLink } from '../../Routes/TransitionLink';
import { State, City } from "country-state-city";
import { baseURL } from '@/url';


export default function SignUp(){
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        state:"",
        city:"",
        password:"",
    });
    
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate=useNavigate();

     // Code for City and State Dropdown
     const defaultCountryCode = "IN"; // India
     const [states, setStates] = useState([]);
     const [cities, setCities] = useState([]);
   
     const [selectedState, setSelectedState] = useState("");
     const [selectedCity, setSelectedCity] = useState("");
   
     useEffect(() => {
       setStates(State.getStatesOfCountry(defaultCountryCode));
     }, []);
   
     useEffect(() => {
       if (selectedState) {
         setCities(City.getCitiesOfState(defaultCountryCode, selectedState));
         setSelectedCity("");
       }
     }, [selectedState]);


    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            // Assuming your backend route is /api/send-otp
            const response = await axios.post(`${baseURL}/api/auth/send-otp`, {email: formData.email,});

            if (response.data.success) {
            alert("OTP sent successfully!");
            // Optionally store OTP token or navigate to OTP verification
            } else {
            alert("Failed to send OTP. Please try again.");
            }
            setError(null);
            setLoading(false);
            setStep(2);
        }catch(error){
            setError(error.message);
            setLoading(false);
        }
        
    }

    const handleSubmit2=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            // Assuming your backend route is /api/send-otp
            const response = await axios.post(`${baseURL}/api/auth/verify-otp`, {email: formData.email,otp: otp,});
            console.log(response)
            if (response.data.success) {
            alert("OTP Verified!");
            createUser();
            } else {
            alert("Wrong OTP. Please try again.");
            setError(response.data.message)
            }
            setError(null);
            setLoading(false);
            setStep(2);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message); // 👈 use custom backend message
              console.log(error.response.data.message);
            } else {
              setError(error.message); // fallback for network/server crash
              console.log(error.message);
            }
            setLoading(false);
          }        
    }

    const createUser=async()=>{
        setLoading(true);
        try{
            const response = await axios.post(`${baseURL}/api/auth/signup`, formData);
            console.log(response)
            if (response.status==201) {
            alert("User Created Successfully");
            navigate('/');
            } else {
            alert("Something Went Wrong");
            setError(response.data.message)
            }
            setError(null);
            setLoading(false);
            setStep(1);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message); // 👈 use custom backend message
              console.log(error.response.data.message);
            } else {
              setError(error.message); // fallback for network/server crash
              console.log(error.message);
            }
            setLoading(false);
          }   
    }
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [id]: value
        }));
      };
      

   
    


    return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]'>
        <div className=' px-[4.5vw] md:px-[4vw] w-full  md:w-[47.375vw] md:max-w-[762px] '>
            <div className='flex flex-col h-full'>
                {step==1?
                <div className=' w-full mx-auto '>
                    <h3 className='font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold'>
                        Sign Up
                    </h3>
                    <p className='font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]'>
                        Login to your own world of eyewear
                    </p>
                    <div className='flex flex-col gap-[4vw] md:gap-[1.5vw]'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText'>
                        <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='name' type="text" placeholder="Name" onChange={handleChange}/>
                        <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='email' type="email" placeholder="Email" onChange={handleChange}/>
                        <select className="border-[1.5px] p-[2vw]  md:p-[.75vw] bg-white border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]" id="state"
                            value={selectedState} onChange={(e) => {setSelectedState(e.target.value),handleChange(e)}}>
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                                </option>
                            ))}
                        </select>

                        <select className="border-[1.5px] p-[2vw] md:pr-[2vw] md:p-[.75vw] bg-white border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]" value={selectedCity} id="city"
                            onChange={(e) => {setSelectedCity(e.target.value), handleChange(e)}} disabled={!selectedState}>
                            <option value="">Select City</option>
                            {cities.map((city, idx) => (
                                <option key={idx} value={city.name}>
                                {city.name}
                                </option>
                            ))}
                            </select>
                        <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='password' type="text" placeholder="Password" onChange={handleChange}/>
                        <button disabled={loading} className='border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white' onClick={handleSubmit}  >{loading?"loading":"Next"}</button>
                    </form>
                        <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[2px]" />
                        
                    {/* {error && <p className='text-red-500'>{error}</p>} */}
                        <div className='font-roboto text-regularTextPhone md:text-regularText '>
                            <p className='text-center leading-[150%]'>Already have an account? <TransitionLink to='/login' ><span className='underline'>Login</span></TransitionLink> | <span className='underline'> <TransitionLink to='/' >Home</TransitionLink></span></p>
                        </div>
                    </div>
                </div>:
                <div className=' w-full mx-auto'>
                    <h3 className='font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold'>
                        Verify OTP
                    </h3>
                    <p className='font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]'>
                        Login to your own world of eyewear
                    </p>
                    <div className='flex flex-col gap-[1.5vw]'>
                    <form onSubmit={handleSubmit2} className='flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText'>
                        <input className='border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw]' id='otp' type='number' placeholder="otp" onChange={(e)=>{setOtp(e.target.value)}}/>
                        <button disabled={loading} onClick={handleSubmit2} className='border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white'>{loading?"loading":"Send OTP"}</button>
                        
                    </form>
                        <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[2px]" />
                        
                    {/* {error && <p className='text-red-500'>{error}</p>} */}
                        <div className='font-roboto text-regularTextPhone md:text-regularText'>
                            <p className='text-center leading-[150%]'>Already have an account? <TransitionLink to='/signin' ><span className='underline'>SignIn</span></TransitionLink> | <span className='underline'> <TransitionLink to='/' >Home</TransitionLink></span></p>
                        </div>
                    </div>

                    </div>}
            </div>
        
        </div>
        <div className='w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden'>
            <img className='h-auto w-full' src={LoginImg}></img>
        </div>

    </div>
    );
};
