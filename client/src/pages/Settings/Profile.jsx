import React,{useState} from 'react';
import EditIcon from '../../assets/images/icons/Edit.svg';

export default function Profile(){
    const [selectedGender, setSelectedGender] = useState('Male');
    const [formData, setFormData] = useState({'Gender':'Male'});
    
    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
        setFormData({
            ...formData,
            'Gender': event.target.value,
        });
      };

    const handleFormChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
            });
        }
    console.log(formData);
      return (
        <>
                    <div className='flex flex-row gap-[2.5vw] items-center'>
                        <h6 className='text-h6Text font-bold'>Personal Information</h6>
                        <img src={EditIcon} className='w-[1.6875vw] h-[1.6875vw]'></img>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Name</h6>
                        <div className='flex flex-row gap-[1.25vw]'>
                            <input id='Name' onChange={handleFormChange} type='text' className='w-[18.875vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='Name'></input>
                            <input id='Surname' onChange={handleFormChange} type='text' className='w-[18.875vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='Surname'></input>
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
                        <input id='Email' onChange={handleFormChange} type='email' className='w-[28.25vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='example@gmail.com'></input>
                    </div>
                    <div>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Contact Number</h6>
                        <input id='PhoneNumber' onChange={handleFormChange} type='number' className='w-[17.3125vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='12345678'></input>
                    </div>
                    <div>
                        <div className='flex flex-row w-full'>
                        <h6 className='text-h6Text font-bold mb-[1.25vw]'>Address</h6>
                        <h6 className='text-h6Text font-bold ml-auto mb-[1.25vw] mr-[.5vw]'>Zip Code</h6>
                        </div>
                        
                        <div className='flex flex-row gap-[1.25vw]'>
                            <input id='Address' onChange={handleFormChange} type='text' className='w-[33.875vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='Address'></input>
                            <input id='ZipCode' onChange={handleFormChange} type='number' className='w-[25vw] p-[.75vw] text-regularText border-black border-[1px] rounded-[3.75vw] placeholder-[rgba(80,80,80,1)]' placeholder='123456'></input>
                        </div>
                    </div>
                    <button className='ml-auto py-[.5vw] px-[.875vw] w-[13.125vw] h-[3.5vw] text-regularText rounded-[3.5vw] bg-white  shadow-[0px_4px_10px_rgba(0,_0,_0,_0.5)]'>
                        Apply Changes
                    </button>
                </>)
}