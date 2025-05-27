import {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LoginImg from '../../assets/images/LoginImg.png'
import { TransitionLink } from '../../Routes/TransitionLink';
import { State, City } from "country-state-city";
import { baseURL } from '@/url';
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignUp(){
    const [formData,setFormData]=useState({
        name: "",
        email: "",
        state: "",
        city: "",
        password: "",
    });
    
    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        state: "",
        city: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
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

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        // State validation
        if (!formData.state) {
            errors.state = 'State is required';
            isValid = false;
        }

        // City validation
        if (!formData.city) {
            errors.city = 'City is required';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/auth/send-otp`, {
                email: formData.email,
            }, {
                withCredentials: true
              });

            if (response.data.success) {
                setStep(2);
            } else {
                setError(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Failed to send OTP");
            } else if (error.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("OTP send error:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateOTP = () => {
        if (!otp) {
            setError("OTP is required");
            return false;
        }
        if (!/^\d{6}$/.test(otp)) {
            setError("OTP must be 6 digits");
            return false;
        }
        return true;
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateOTP()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/auth/verify-otp`, {
                email: formData.email,
                otp: otp,
            }, {
                withCredentials: true
              });

            if (response.data.success) {
                await createUser();
            } else {
                setError(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "OTP verification failed");
            } else if (error.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("OTP verification error:", error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/auth/signup`, formData, {
                withCredentials: true
              });
            if (response.status === 201) {
                navigate('/login');
            } else {
                setError(response.data.message || "Failed to create account");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Failed to create account");
            } else if (error.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("An unexpected error occurred.");
            }
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error when user starts typing
        setFormErrors(prev => ({
            ...prev,
            [id]: ''
        }));
        setError(null);
    };

    return (
        <div className='flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]'>
            <div className='px-[4.5vw] md:px-[4vw] w-full md:w-[47.375vw] md:max-w-[762px]'>
                <div className='flex flex-col h-full'>
                    {step === 1 ? (
                        <div className='w-full mx-auto'>
                            <h3 className='font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold'>
                                Sign Up
                            </h3>
                            <p className='font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]'>
                                Create your account to explore our eyewear collection
                            </p>
                            <div className='flex flex-col gap-[4vw] md:gap-[1.5vw]'>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText'>
                                    <div>
                                        <input
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${formErrors.name ? 'border-red-500' : ''}`}
                                            id='name'
                                            type="text"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {formErrors.name && <p className='text-red-500 text-sm mt-1'>{formErrors.name}</p>}
                                    </div>
                                    <div>
                                        <input
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${formErrors.email ? 'border-red-500' : ''}`}
                                            id='email'
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {formErrors.email && <p className='text-red-500 text-sm mt-1'>{formErrors.email}</p>}
                                    </div>
                                    <div>
                                        <select
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] bg-white border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${formErrors.state ? 'border-red-500' : ''}`}
                                            id="state"
                                            value={selectedState}
                                            onChange={(e) => {
                                                setSelectedState(e.target.value);
                                                handleChange(e);
                                            }}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.state && <p className='text-red-500 text-sm mt-1'>{formErrors.state}</p>}
                                    </div>
                                    <div>
                                        <select
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] bg-white border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${formErrors.city ? 'border-red-500' : ''}`}
                                            id="city"
                                            value={selectedCity}
                                            onChange={(e) => {
                                                setSelectedCity(e.target.value);
                                                handleChange(e);
                                            }}
                                            disabled={!selectedState}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, idx) => (
                                                <option key={idx} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.city && <p className='text-red-500 text-sm mt-1'>{formErrors.city}</p>}
                                    </div>
                                    <div className="relative">
                                        <input
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${formErrors.password ? 'border-red-500' : ''}`}
                                            id='password'
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-[2vw] md:right-[.75vw] top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <VisibilityOff className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw]" /> : <Visibility className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw]" />}
                                        </button>
                                        {formErrors.password && <p className='text-red-500 text-sm mt-1'>{formErrors.password}</p>}
                                    </div>
                                    <button
                                        disabled={loading}
                                        className='border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                                    >
                                        {loading ? "Loading..." : "Next"}
                                    </button>
                                </form>
                                <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[2px]" />
                                {error && <p className='text-red-500 text-center'>{error}</p>}
                                <div className='font-roboto text-regularTextPhone md:text-regularText'>
                                    <p className='text-center leading-[150%]'>Already have an account? <TransitionLink to='/login'><span className='underline'>Login</span></TransitionLink> | <span className='underline'><TransitionLink to='/'>Home</TransitionLink></span></p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full mx-auto'>
                            <h3 className='font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold'>
                                Verify OTP
                            </h3>
                            <p className='font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]'>
                                Enter the OTP sent to your email
                            </p>
                            <div className='flex flex-col gap-[1.5vw]'>
                                <form onSubmit={handleSubmit2} className='flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText'>
                                    <div>
                                        <input
                                            className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${error ? 'border-red-500' : ''}`}
                                            id='otp'
                                            type='number'
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value);
                                                setError(null);
                                            }}
                                            maxLength={6}
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className='border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </form>
                                <div className="w-full my-[1vw] relative border-black border-t-[1px] border-solid box-border h-[2px]" />
                                {error && <p className='text-red-500 text-center'>{error}</p>}
                                <div className='font-roboto text-regularTextPhone md:text-regularText'>
                                    <p className='text-center leading-[150%]'>Didn't receive OTP? <button onClick={handleSubmit} className='underline text-blue-600'>Resend</button></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden'>
                <img className='h-full w-full' src={LoginImg} alt="Signup illustration" />
            </div>
        </div>
    );
};
