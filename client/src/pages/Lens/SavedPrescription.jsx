import React,{useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { baseURL } from '@/url';
import { loginSuccess } from '@/redux/slice/authSlice';
import { TitleButton2 } from '@/components/button';
import { CartButton } from '@/components/button';
import { formatINR } from '@/components/IntToPrice';

const SavedPrescription = ( {setSubFocusedPrescription,addProductToCart,form,setForm,amount} ) => {
    const [prescriptions,setPrescriptions]=useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        updateUser();
        getPrescriptions();

    },[]);
    const updateUser = async () => {
        const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: userRes.data.user }));
        
    }
    const getPrescriptions = async () => {
        const prescriptionsRes = await axios.get(`${baseURL}/api/user/prescription/${user._id}`, { withCredentials: true });
        setPrescriptions(prescriptionsRes.data.prescriptions);
    }

    const handlePrescriptionSelect = (prescriptionId) => {
        setSelectedPrescription(prescriptionId);
        setForm({...form, prescriptionId: prescriptionId});
    }

  return (
    <div id='prescriptionFormMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Saved Prescription</h1>
            <div className='mx-auto py-[4vw] md:py-[1vw] px-[5vw] md:px-[1vw] w-full md:w-[69.75vw] flex flex-col gap-[4vw] md:gap-[1vw] font-roboto text-regularTextPhone md:text-regularText'>
               {user.prescriptions.length>0?<>
               {prescriptions.map((prescription)=>(
                <label key={prescription._id} className='flex items-center bg-white p-[4vw] md:p-[1vw] rounded-[2vw] md:rounded-[.5vw] shadow-[0px_1vw_1vw_rgba(0,_0,_0,_0.25)] md:shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] gap-[4vw] md:gap-[1vw] cursor-pointer hover:bg-gray-50 transition-colors'>
                    <input 
                        type="radio" 
                        name="prescription" 
                        value={prescription._id}
                        checked={selectedPrescription === prescription._id}
                        onChange={() => handlePrescriptionSelect(prescription._id)}
                        className='w-[4.8vw] md:w-[1.2vw] h-[4.8vw] md:h-[1.2vw] bg-gray-100 border-gray-300 accent-black'
                    />
                    <div className='flex flex-col gap-[2vw] md:gap-[.5vw] flex-1'>
                        <p className='text-mediumTextPhone md:text-mediumText leading-[150%] font-roboto font-bold'>Prescription Name: {prescription.prescriptionName}</p>
                        <p className='text-smallTextPhone md:text-smallText leading-[150%] font-roboto'>Prescription Date: {prescription.prescriptionDate}</p>
                    </div>
                </label>
               ))}
                    
                    <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-0'>
                        <h5 className='text-h5TextPhone md:text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                        <CartButton onClick={() => {
                            const updatedForm = {...form, prescriptionId:selectedPrescription};
                            setForm(updatedForm);
                            setTimeout(() => addProductToCart(updatedForm), 0);
                        }} />
                      </div>
               </>:<p className='text-mediumTextPhone md:text-mediumText text-center leading-[150%] font-roboto font-bold'>No prescriptions found</p>  }
            </div>

        </div>
  )
}

export default SavedPrescription
