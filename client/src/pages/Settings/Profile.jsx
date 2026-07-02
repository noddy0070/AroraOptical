import React,{useState,useMemo} from 'react';
import EditIcon from '../../assets/images/icons/Edit.svg';
import { baseURL } from '@/url';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slice/authSlice';


export default function Profile({user}){

    const [formData,setFormData]=useState({
        id:user._id,
        name:user.name,
        gender:user?.gender || 'Male',
        email:user.email,
        number:user?.number,
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

      return (
        <>
                    <div className='flex flex-row gap-[6vw] md:gap-[2.5vw] items-center'>
                        <h6 className='text-h6TextPhone md:text-h6Text font-bold'>Personal Information</h6>
                        <button onClick={()=>{setDisableEdit(!disableEdit)}}>
                        <img src={EditIcon} className='w-[6.75vw] md:w-[1.6875vw] h-[6.75vw] md:h-[1.6875vw]'/>
                        </button>
                    </div>
                    <div>
                        <h6 className='text-h6TextPhone md:text-h6Text font-bold mb-[5vw] md:mb-[1.25vw]'>Name</h6>
                        <div className='flex flex-col md:flex-row gap-[3vw] md:gap-[1.25vw]'>
                            <input disabled={disableEdit} id='firstName' onChange={handleFormChange} value={firstName} type='text' className={`w-full md:w-[18.875vw] p-[3vw] md:p-[.75vw] text-regularTextPhone md:text-regularText rounded-[15vw] md:rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='Name'></input>
                            <input disabled={disableEdit} id='lastName' onChange={handleFormChange} value={lastName} type='text' className={`w-full md:w-[18.875vw] p-[3vw] md:p-[.75vw] text-regularTextPhone md:text-regularText border-black border-[1px] rounded-[15vw] md:rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} placeholder='Surname'></input>
                        </div>
                    </div>
                    <div>
                        <h6 className='text-h6TextPhone md:text-h6Text font-bold mb-[5vw] md:mb-[1.25vw]'>Your Gender</h6>
                        <div className='flex flex-row gap-[6vw] md:gap-[1.5vw] px-[4vw] md:px-[1vw]'>
                            <label className='py-[4vw] md:py-[1vw] flex flex-row text-regularTextPhone md:text-regularText'>
                            <input type='radio' checked={selectedGender==='Male'} onChange={handleGenderChange} value='Male' className=' accent-black w-[4.5vw] md:w-[1.125vw] h-[4.5vw] md:h-[1.125vw] my-auto mr-[3vw] md:mr-[.75vw]'/>Male</label>
                            <label className='py-[4vw] md:py-[1vw] flex flex-row text-regularTextPhone md:text-regularText'><input type='radio' checked={selectedGender==='Female'} onChange={handleGenderChange} value='Female' className=' accent-black w-[4.5vw] md:w-[1.125vw] h-[4.5vw] md:h-[1.125vw] my-auto mr-[3vw] md:mr-[.75vw]'/>Female</label>
                        </div>
                    </div>
                    <div>
                        <h6 className='text-h6TextPhone md:text-h6Text font-bold mb-[5vw] md:mb-[1.25vw]'>Email</h6>
                        <input id='email' onChange={handleFormChange} disabled={true} type='email' value={formData.email} className={`w-full md:w-[28.25vw] p-[3vw] md:p-[.75vw] text-regularTextPhone md:text-regularText rounded-[15vw] md:rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]  border-gray-500 border-[1px]`} placeholder='example@gmail.com'></input>
                    </div>
                    <div>
                        <h6 className='text-h6TextPhone md:text-h6Text font-bold mb-[5vw] md:mb-[1.25vw]'>Contact Number</h6>
                        <input disabled={disableEdit} id='number' onChange={handleFormChange} type='number' value={formData.number!=null?formData.number:undefined} placeholder='Enter Number' className={`w-full md:w-[17.3125vw] p-[3vw] md:p-[.75vw] text-regularTextPhone md:text-regularText border-black border-[1px] rounded-[15vw] md:rounded-[3.75vw] placeholder-[rgba(80,80,80,1)] ${disableEdit?" border-gray-500 border-[1px]":"border-black border-[1px]"}`} ></input>
                    </div>
                    <button onClick={handleSubmit} className='ml-auto py-[2vw] md:py-[.5vw] px-[3.5vw] md:px-[.875vw] w-full md:w-[13.125vw] h-[14vw] md:h-[3.5vw] text-regularTextPhone md:text-regularText rounded-[14vw] md:rounded-[3.5vw] bg-white shadow-[0px_4px_10px_rgba(0,_0,_0,_0.5)]'>
                        Apply Changes
                    </button>
                </>)
}