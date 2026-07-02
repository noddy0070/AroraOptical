import React,{useState,useEffect,useRef} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { api } from '@/lib/axios';
import { loginSuccess } from '@/redux/slice/authSlice';
import { CartButton, ContactUsButton } from '@/components/button';
import { PriceBreakdown, formatCoatingLabel } from '@/components/lensFeatureBox';
import { ChevronDown } from 'lucide-react';

const SavedPrescription = ( {setSubFocusedPrescription,addProductToCart,form,setForm,amount,refreshKey=0,basePrice=0,coatingPrice=null,thicknessPrice=null,isSellable=true,getContactUrl} ) => {
    const [prescriptions,setPrescriptions]=useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState('');
    const [hasMoreBelow, setHasMoreBelow] = useState(false);
    const listRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        updateUser();
        getPrescriptions();

    },[refreshKey]);
    const updateUser = async () => {
        const userRes = await api.get('/api/auth/me', {  });
        dispatch(loginSuccess({ user: userRes.data.user }));

    }
    const getPrescriptions = async () => {
        const prescriptionsRes = await api.get(`/api/user/prescription/${user._id}`, {  });
        setPrescriptions(prescriptionsRes.data.prescriptions);
    }

    const handlePrescriptionSelect = (prescriptionId) => {
        setSelectedPrescription(prescriptionId);
        setForm({...form, prescriptionId: prescriptionId});
    }

    const checkScrollable = () => {
        const el = listRef.current;
        if (!el) return;
        setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    }

    useEffect(() => {
        checkScrollable();
    }, [prescriptions]);

  return (
    <div id='prescriptionFormMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0 flex flex-col overflow-hidden h-[calc(100dvh_-_20vw)] max-h-[calc(100dvh_-_20vw)] md:h-[calc(100dvh_-_8vw)] md:max-h-[calc(100dvh_-_8vw)]'>
            <h1 className='flex-shrink-0 font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Saved Prescription</h1>
               {user.prescriptions.length>0?<>
               <div className='relative flex-1 min-h-0'>
                 <div
                   ref={listRef}
                   onScroll={checkScrollable}
                   className='mx-auto py-[4vw] md:py-[1vw] px-[5vw] md:px-[1vw] w-full md:w-[69.75vw] flex flex-col gap-[4vw] md:gap-[1vw] font-roboto text-regularTextPhone md:text-regularText h-full overflow-y-auto overscroll-contain'
                   style={{ WebkitOverflowScrolling: 'touch' }}
                 >
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
                 </div>
                 {hasMoreBelow && (
                    <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-[10vw] md:h-[3vw] bg-gradient-to-t from-offwhitebg to-transparent flex items-end justify-center pb-[.5vw]'>
                        <ChevronDown className='animate-bounce text-gray-500' size={20} />
                    </div>
                 )}
               </div>

                    <div className='relative z-10 flex-shrink-0 bg-offwhitebg mx-auto mt-[4vw] md:mt-[1vw] pt-[3vw] md:pt-[.75vw] px-[5vw] md:px-[1vw] items-center flex flex-row w-full md:w-[69.75vw] justify-end md:justify-start gap-[4vw] md:gap-[2vw] border-t border-gray-200'>
                        <PriceBreakdown
                            base={basePrice}
                            coatingLabel={form.lensCoating ? formatCoatingLabel(form.lensCoating) : null}
                            coatingPrice={form.lensCoating ? coatingPrice : null}
                            thicknessLabel={form.lensThickness || null}
                            thicknessPrice={form.lensThickness ? thicknessPrice : null}
                        />
                        {isSellable ? (
                            <CartButton disabled={!selectedPrescription} onClick={() => {
                                if (!selectedPrescription) return;
                                const updatedForm = {...form, prescriptionId:selectedPrescription};
                                setForm(updatedForm);
                                setTimeout(() => addProductToCart(updatedForm), 0);
                            }} />
                        ) : (
                            <ContactUsButton disabled={!selectedPrescription} href={selectedPrescription ? getContactUrl({...form, prescriptionId:selectedPrescription}, amount) : undefined} />
                        )}
                      </div>
               </>:<p className='text-mediumTextPhone md:text-mediumText text-center leading-[150%] font-roboto font-bold'>No prescriptions found</p>  }
        </div>
  )
}

export default SavedPrescription
