import React,{useEffect, useState,useMemo} from 'react';
import EditIcon from '../../assets/images/icons/Edit.svg';
import { State, City } from "country-state-city";
import { baseURL } from '@/url';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slice/authSlice';


export default function Profile({user}){

    const defaultCountryCode = "IN"; // India
    const [states, setStates] = useState([user?.state||'']);
    const [cities, setCities] = useState([user?.city||'']);
    const [selectedState, setSelectedState] = useState(user?.state||"");
    const [selectedCity, setSelectedCity] = useState(user?.city||"");
    const [formData,setFormData]=useState({
        id:user._id,
        name:user.name,
        gender:user?.gender || 'Male',
        email:user.email,
        number:user?.number,
        city:selectedCity,
        state:selectedState,
        address:user?.address,
        zipcode:user?.zipcode,
    })


    const [loading,setLoading]=useState(false);
    const [error,setError] =useState();

    const [selectedGender, setSelectedGender] = useState(formData.gender);
    const [firstName, lastName] = useMemo(() => {
        const nameParts = formData.name?.trim().split(' ') || [];
        const first = nameParts[0] || '';
        const last = nameParts.slice(1).join(' ') || '';
        return [first, last];
    }, [formData.name]);


    
    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
        setFormData({
            ...formData,
            'gender': event.target.value,
        });
      };

    const handleFormChange = (e) => {
        if(e.target.id=='lastName'){
            setFormData({
                ...formData,
                'name':firstName +" " + e.target.value
            })
        }else if(e.target.id=='firstName'){
            setFormData({
                ...formData,
                'name':e.target.value +" " + lastName
            })
        }
        else{
            setFormData({
            ...formData,
            [e.target.id]: e.target.value,
            });
        }
        }

       
   
     useEffect(() => {
       setStates(State.getStatesOfCountry(defaultCountryCode));
     }, []);
   
     useEffect(() => {
       if (selectedState) {
         setCities(City.getCitiesOfState(defaultCountryCode, selectedState));
         setSelectedCity(user?.city||'');
       }
     }, [selectedState]);

    const [disableEdit, setDisableEdit] =useState(true);  
    const dispatch=useDispatch();  
    
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setDisableEdit(true);
        setLoading(true);
        try{
            const response = await axios.post(`${baseURL}/api/user/update/${user._id}`, formData, {
                withCredentials: true
              });

            if (response.data.success) {
            alert("Updated Profile Successfully");
            dispatch(loginSuccess({ user: response.data.message }));

        } else {
            alert("Failed to Update Profile, Try Again.");
            }
            setError(null);
            setLoading(false);
        }catch(error){
            setError(error.message);
            setLoading(false);
            console.log(error.message);
        }
    }

    // console.log(formData);

      return (
        <>
                    <div className='flex flex-row gap-[2.5vw] items-center'>
                        <h6 className='text-h6Text font-bold'>Personal Information</h6>
                        <button onClick={()=>{setDisableEdit(!disableEdit)}}>
                        <img src={EditIcon} className='w-[1.6875vw] h-[1.6875vw]'/>
                        </button>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Name</h6>
                        <div className='flex flex-row gap-[1.25vw]'>
                            <input disabled={disableEdit} id='firstName' onChange={handleFormChange} value={firstName} type='text' className={`w-[18.875vw] p-[.75vw] text-regularText   rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='Name'></input>
                            <input disabled={disableEdit} id='lastName' onChange={handleFormChange} value={lastName} type='text' className={`w-[18.875vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='Surname'></input>
                        </div>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Your Gender</h6>
                        <div className='flex flex-row gap-[1.5vw] px-[1vw]'>
                            <label className='py-[1vw]   flex flex-row'>
                            <input type='radio' checked={selectedGender==='Male'} onChange={handleGenderChange} value='Male' className=' accent-black w-[1.125vw] h-[1.125vw] my-auto mr-[.75vw]   text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]'/>Male</label>
                            <label className='py-[1vw] flex flex-row'><input type='radio' checked={selectedGender==='Female'} onChange={handleGenderChange} value='Female' className=' accent-black w-[1.125vw] h-[1.125vw] my-auto mr-[.75vw]   text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]'/>Female</label>
                        </div>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Email</h6>
                        <input id='email' onChange={handleFormChange} disabled={true} type='email' value={formData.email} className={`w-[28.25vw] p-[.75vw] text-regularText rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]  border-gray-500 border-[1px]`} placeholder='example@gmail.com'></input>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Contact Number</h6>
                        <input disabled={disableEdit} id='number' onChange={handleFormChange} type='number' value={formData.number!=null?formData.number:undefined} placeholder='Enter Number' className={`w-[17.3125vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} ></input>
                    </div>
                    <div>
                        <div className='flex flex-row w-full'>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>State</h6>
                        <h6 className='text-h6Text font-bold ml-auto mb-[1.25vw] mr-[.5vw]'>City</h6>
                        </div>
                        <div className='flex flex-row gap-[1.25vw]'>

                           <div className="relative w-[33.875vw]">
                                <select className={`appearance-none w-full p-[.75vw] pr-[2.5vw] text-regularText border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${ disableEdit ? "border-gray-500" : "border-black" }`}
                                    disabled={disableEdit} id="state" value={selectedState}
                                    onChange={(e) => { setSelectedState(e.target.value); handleFormChange(e); }} >
                                    <option value="">Select State</option>
                                    {states.map((state,index) => (
                                    <option key={index} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                    ))}
                                </select>

                            <div className="pointer-events-none absolute right-[1vw] top-1/2 -translate-y-1/2">
                                <svg className="w-[1vw] h-[1vw] text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            </div>

                            <div className="relative w-[25vw]">
                                <select className={`appearance-none w-full p-[.75vw] pr-[2.5vw] text-regularText border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${
                                    disableEdit ? "border-gray-500" : "border-black"}`} value={selectedCity} id="city"
                                    onChange={(e) => { setSelectedCity(e.target.value); handleFormChange(e);}}
                                    disabled={disableEdit || !selectedState }>
                                    <option value="">Select City</option>
                                    {cities.map((city, idx) => (
                                    <option key={idx} value={city.name}>
                                        {city.name}
                                    </option>
                                    ))}
                                </select>

                                {/* Custom Arrow Icon */}
                                <div className="pointer-events-none absolute right-[1vw] top-1/2 -translate-y-1/2">
                                    <svg className="w-[1vw] h-[1vw] text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                </div>
                            </div>
                        </div>
                    <div>
                        <div className='flex flex-row w-full'>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Street Address</h6>
                        <h6 className='text-h6Text font-bold ml-auto mb-[1.25vw] mr-[.5vw]'>Zip Code</h6>
                        </div>
                        
                        <div className='flex flex-row gap-[1.25vw]'>
                            <input disabled={disableEdit} id='address' value={formData.address!=null?formData.address:undefined} onChange={handleFormChange} type='text' className={`w-[33.875vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='Enter Your Address'></input>
                            <input disabled={disableEdit} id='zipcode' value={formData.zipcode!=null?formData.zipcode:undefined} onChange={handleFormChange} type='number' className={`w-[25vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='XXXXXX'></input>
                        </div>

                        
                    </div>
                    <button onClick={handleSubmit} className='ml-auto py-[.5vw] px-[.875vw] w-[13.125vw] h-[3.5vw] text-regularText rounded-[3.5vw] bg-white  shadow-[0px_4px_10px_rgba(0,_0,_0,_0.5)]'>
                        Apply Changes
                    </button>
                </>)
}