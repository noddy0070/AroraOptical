import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '@/url';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSuccess } from '@/redux/slice/authSlice';

export default function PrescriptionForm({form,setSubFocusedPrescription}) {
    const { user } = useSelector(state => state.auth);
    const [twoPD, setTwoPD] = useState(false);
    const [acceptTC, setAcceptTC] = useState(false);
    const [prescriptionForm, setPrescriptionForm] = useState({
        userId: user._id,
        prescriptionName: "",
        prescriptionDate: "",
        prescriptionRightSphere: "",
        prescriptionLeftSphere: "",
        prescriptionRightCylinder: "",
        prescriptionLeftCylinder: "",
        prescriptionRightAxis: "",
        prescriptionLeftAxis: "",
        prescriptionRightNear: "",
        prescriptionLeftNear: "",
        prescriptionPupilsDistance: "",
        prescriptionLeftPupilsDistance: "",
        prescriptionRightPupilsDistance: "",
        prescriptionOtherDetails: "",
    });
    const [error, setError] = useState("");
    const dispatch = useDispatch();



    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        const rightAxis = parseFloat(prescriptionForm.prescriptionRightAxis);
        const leftAxis = parseFloat(prescriptionForm.prescriptionLeftAxis);
        const rightSphere = parseFloat(prescriptionForm.prescriptionRightSphere);
        const rightCylinder = parseFloat(prescriptionForm.prescriptionRightCylinder);
        const leftSphere = parseFloat(prescriptionForm.prescriptionLeftSphere);
        const leftCylinder = parseFloat(prescriptionForm.prescriptionLeftCylinder);
        
        // Check if axis values are between 0 and 180
        if (rightAxis < 0 || rightAxis > 180 || leftAxis < 0 || leftAxis > 180) {
            setError('Axis values must be between 0 and 180 degrees');
            return;
        }
        
        // Check if the sum of right sphere and right cylinder is in range -6 to +6
        const sphereCylinderSum = rightSphere + rightCylinder;
        const leftSphereCylinderSum = leftSphere + leftCylinder;
        if (sphereCylinderSum < -6 || sphereCylinderSum > 6 || leftSphereCylinderSum < -6 || leftSphereCylinderSum > 6) {
            setError('The sum of power must be between -6 and +6');
            return;
        }
        if(prescriptionForm.prescriptionPupilsDistance==="" || prescriptionForm.prescriptionRightAxis==="" || prescriptionForm.prescriptionLeftAxis==="" 
            || prescriptionForm.prescriptionRightSphere==="" || prescriptionForm.prescriptionLeftSphere==="" || prescriptionForm.prescriptionRightCylinder==="" || prescriptionForm.prescriptionLeftCylinder===""
             || prescriptionForm.prescriptionName==="" || prescriptionForm.prescriptionDate===""  || prescriptionForm.prescriptionRightSphere==="" ){
            setError("Enter valid data");
            return;
        }
        setError("");
        
        try{
            const response = await axios.post(`${baseURL}/api/user/prescription/add`, prescriptionForm, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.data.success){
                toast.success('Prescription added successfully');
                setPrescriptionForm({
                    userId: user._id,
                    prescriptionName: "",
                    prescriptionDate: "",
                    prescriptionRightSphere: "",
                    prescriptionLeftSphere: "",
                    prescriptionRightCylinder: "",
                    prescriptionLeftCylinder: "",
                    prescriptionRightAxis: "",
                    prescriptionLeftAxis: "",
                    prescriptionRightNear: "",
                    prescriptionLeftNear: "",
                    prescriptionPupilsDistance: "",
                    prescriptionLeftPupilsDistance: "",
                    prescriptionRightPupilsDistance: "",
                    prescriptionOtherDetails: "",
                })
                setAcceptTC(false);
                setTwoPD(false);
                setSubFocusedPrescription("");
                updateUser();

            }else{
                toast.error('Failed to add prescription');
            }
        }catch(error){
            console.log(error);
            setError("Enter valid prescription");
        }

        const updateUser = async () => {
            const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
            dispatch(loginSuccess({ user: userRes.data.user }));
            
        }
    }

    return (
        <div id='prescriptionFormMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0 overflow-y-auto max-h-[100vh] md:max-h-none'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Enter Prescription</h1>
            <div className='mx-auto py-[4vw] md:py-[1vw] px-[5vw] md:px-[1vw] w-full md:w-[69.75vw] flex flex-col gap-[4vw] md:gap-[1vw] font-roboto text-regularTextPhone md:text-regularText'>
                <p className="text-center text-regularTextPhone md:text-regularText">
                    We strongly recommend you to <a className="underline cursor-pointer text-primary">Upload a Photo</a> of your prescription. It's simple and eliminates any chances for Errors.
                </p>
                <form className="px-[4.5vw] md:px-[1.125vw] flex flex-col gap-[4vw] md:gap-[1vw]">
                    {/* Prescription Name and Date */}
                        <input className="mb-[-6vw] md:mb-[-1.5vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" placeholder="Enter Prescription Name" value={prescriptionForm.prescriptionName} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionName: e.target.value})} />

                    {/* Eyes Table */}
                    <div className="flex flex-col md:flex-row w-full gap-[4vw] md:gap-[1.875vw] overflow-x-auto">
                        <div className="grid grid-rows-3 mr-auto items-center min-w-[30vw] md:min-w-0">
                            <div className="h-px min-h-0 leading-none text-[0]"></div>
                            <span className="font-medium text-regularTextPhone md:text-regularText">Right Eye OD</span>
                            <span className="font-medium text-regularTextPhone md:text-regularText">Left Eye OS</span>
                        </div>
                        {/* Sphere */}
                        <div className="grid grid-rows-3 w-full md:w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.5vw] md:mb-[.125vw] text-regularTextPhone md:text-regularText">Sphere(SPH)</span>
                            <select className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionRightSphere} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightSphere: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 49}, (_, i) => (i - 24) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select  className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionLeftSphere} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftSphere: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 49}, (_, i) => (i - 24) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Cylinder */}
                        <div className="grid grid-rows-3 w-full md:w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.5vw] md:mb-[.125vw] text-regularTextPhone md:text-regularText">Cylinder(CYL)</span>
                            <select className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionRightCylinder} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightCylinder: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 33}, (_, i) => (i - 16) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionLeftCylinder} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftCylinder: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 33}, (_, i) => (i - 16) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Axis */}
                        <div className="grid grid-rows-3 w-full md:w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.5vw] md:mb-[.125vw] text-regularTextPhone md:text-regularText">Axis <span className="text-tinyTextPhone md:text-xs text-gray-500">(0-180)</span></span>
                            <input
                                type="number"
                                min="1"
                                max="180"
                                placeholder="Right Axis"
                                className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText"
                                value={prescriptionForm.prescriptionRightAxis}
                                onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightAxis: e.target.value})}
                            />
                            <input
                                type="number"
                                min="1"
                                max="180"
                                placeholder="Left Axis"
                                className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText"
                                value={prescriptionForm.prescriptionLeftAxis}
                                onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftAxis: e.target.value})}
                            />
                        </div>
                        {/* Near(ADD) */}
                        {form.lensType==="Bifocal"? <div className="grid grid-rows-3 w-full md:w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.5vw] md:mb-[.125vw] text-regularTextPhone md:text-regularText">Near(ADD)</span>
                            <select className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionRightNear} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightNear: e.target.value})}>
                                <option value="">--</option>
                                {Array.from({length: 12}, (_, i) => ((i+2) * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                            <select className="my-[1vw] md:my-[.25vw] py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] w-full border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionLeftNear} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftNear: e.target.value})}>
                                <option value="">--</option>
                                {Array.from({length: 12}, (_, i) => ((i+2) * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                        </div>:<div className="grid grid-rows-3 w-full md:w-[10vw] items-center"></div>}
                    </div>
                    {/* Date and PD */}
                    <div className="flex flex-col md:flex-row gap-[4vw] md:gap-[1vw] items-start md:items-center">
                        <div className="flex flex-col w-full md:w-[20vw]">
                            <span className="font-medium mb-[1vw] md:mb-[.25vw] text-regularTextPhone md:text-regularText">Date of prescription</span>
                            <input className="py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] text-regularTextPhone md:text-regularText" placeholder="dd-mm-yyyy" type="date" value={prescriptionForm.prescriptionDate} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionDate: e.target.value})} />
                        </div>
                        <div className="flex flex-col w-full md:w-[28vw]">
                            <span className="font-medium mb-[1vw] md:mb-[.25vw] text-regularTextPhone md:text-regularText">Pupils Distance* {prescriptionForm.prescriptionRightCylinder>=3 || prescriptionForm.prescriptionLeftCylinder>=3 ||prescriptionForm.prescriptionRightCylinder<=-3 || prescriptionForm.prescriptionLeftCylinder<=-3 ? <span className="text-tinyTextPhone md:text-xs text-gray-500">(Recommended to add left and right PD)</span> : ""}</span>
                            <div className="flex flex-row gap-[2vw] md:gap-[.5vw] items-center">
                                    <input className="py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] w-full text-regularTextPhone md:text-regularText" placeholder="63 (Average/Don`t Know)" type="text" value={prescriptionForm.prescriptionPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionPupilsDistance: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-[28vw]">
                            <label className="flex flex-row items-center gap-[1vw] md:gap-1 mb-[2vw] md:mb-[.5vw] ml-0 md:ml-auto">
                                <input type="checkbox" checked={twoPD} onChange={e => setTwoPD(e.target.checked)} className="accent-primary w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw]" />
                                <span className="text-tinyTextPhone md:text-xs">2 PD Numbers</span>
                            </label>
                            <div className="flex flex-row gap-[2vw] md:gap-[.5vw] items-center">
                                {twoPD && (
                                    <>
                                        <select className="py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] w-full text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionLeftPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftPupilsDistance: e.target.value})}>
                                            <option value="">Left PD</option>
                                            {Array.from({length: 35}, (_, i) => (23 + i * 0.5).toFixed(1)).map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                        <select className="py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] w-full text-regularTextPhone md:text-regularText" value={prescriptionForm.prescriptionRightPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightPupilsDistance: e.target.value})}>
                                            <option value="">Right PD</option>
                                            {Array.from({length: 35}, (_, i) => (23 + i * 0.5).toFixed(1)).map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Other Details */}
                    <div className="flex flex-col mt-[2vw] md:mt-[.5vw]">
                        <span className="font-medium mb-[1vw] md:mb-[.25vw] text-regularTextPhone md:text-regularText">Other Details</span>
                        <textarea className="py-[2.5vw] md:py-[.625vw] px-[4vw] md:px-[1vw] border-[1px] border-black rounded-[2vw] md:rounded-[.5vw] w-full resize-none text-regularTextPhone md:text-regularText" rows={2} placeholder="Any extra information here that would like us to know - if you need the glasses for reading or distance, or whether your prescription has prism, etc." value={prescriptionForm.prescriptionOtherDetails} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionOtherDetails: e.target.value})} />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex flex-row items-start gap-[2vw] md:gap-2 mt-[2vw] md:mt-[.5vw]">
                        <input type="checkbox" checked={acceptTC} onChange={e => setAcceptTC(e.target.checked)} className="accent-primary w-[4vw] md:w-[1vw] h-[4vw] md:h-[1vw] mt-[1vw] md:mt-[.25vw]" />
                        <span className="text-tinyTextPhone md:text-xs text-[#757575]">I accept the <a className="underline cursor-pointer">Terms & Conditions</a>. I certify that the wearer is over 16 years old and that they are not registered blind or partially sighted. I also confirm that the prescription details above have been entered correctly and I am happy that no errors have been made.</span>
                    </div>

                    {/* Submit Button */}
                    <button disabled={!acceptTC}  type="submit" className="mt-[4vw] md:mt-[1vw] w-full py-[3vw] md:py-[.75vw] rounded-[2vw] md:rounded-[.5vw] bg-darkslategrey text-white font-bold text-h5TextPhone md:text-lg hover:bg-black transition-colors" onClick={handleSubmit}>Submit Prescription</button>
                    {error && <p className="text-red-500 text-tinyTextPhone md:text-xs mt-[2vw] md:mt-[.5vw]">{error}</p>}
                </form>
            </div>
                </div>
            );
}