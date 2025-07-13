import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '@/url';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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


    const handleSubmit = async (e) => {
        e.preventDefault();
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
                

            }else{
                toast.error('Failed to add prescription');
            }
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div id='prescriptionFormMain' className=''>
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Enter Prescription</h1>
            <div className='mx-auto py-[1vw] px-[1vw] w-[69.75vw] flex flex-col gap-[1vw] font-roboto text-regularText'>
                <p className="text-center">
                    We strongly recommend you to <a className="underline cursor-pointer text-primary">Upload a Photo</a> of your prescription. It's simple and eliminates any chances for Errors.
                </p>
                <form className="px-[1.125vw] flex flex-col gap-[1vw]">
                    {/* Prescription Name and Date */}
                        <input className="mb-[-1.5vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" placeholder="Enter Prescription Name" value={prescriptionForm.prescriptionName} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionName: e.target.value})} />

                    {/* Eyes Table */}
                    <div className="flex flex-row w-full gap-[1.875vw]">
                        <div className="grid grid-rows-3 mr-auto items-center ">
                            <div className="h-px min-h-0 leading-none text-[0]"></div>
                            <span className="font-medium">Right Eye OD</span>
                            <span className="font-medium">Left Eye OS</span>
                        </div>
                        {/* Sphere */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto  mb-[.125vw]">Sphere(SPH)</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionRightSphere} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightSphere: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 98}, (_, i) => (i - 48) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select  className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionLeftSphere} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftSphere: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 98}, (_, i) => (i - 48) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Cylinder */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Cylinder(CYL)</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionRightCylinder} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightCylinder: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 50}, (_, i) => (i - 24) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionLeftCylinder} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftCylinder: e.target.value})}>
                                <option value="">+/-</option>
                                {Array.from({length: 50}, (_, i) => (i - 24) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Axis */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Axis</span>
                            <input
                                type="number"
                                min="1"
                                max="180"
                                placeholder="Right Axis"
                                className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]"
                                value={prescriptionForm.prescriptionRightAxis}
                                onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightAxis: e.target.value})}
                            />
                            <input
                                type="number"
                                min="1"
                                max="180"
                                placeholder="Left Axis"
                                className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]"
                                value={prescriptionForm.prescriptionLeftAxis}
                                onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftAxis: e.target.value})}
                            />
                        </div>
                        {/* Near(ADD) */}
                        {form.lensType==="Bifocal"? <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Near(ADD)</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionRightNear} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightNear: e.target.value})}>
                                <option value="">--</option>
                                {Array.from({length: 16}, (_, i) => ((i+1) * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" value={prescriptionForm.prescriptionLeftNear} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftNear: e.target.value})}>
                                <option value="">--</option>
                                {Array.from({length: 16}, (_, i) => ((i+1) * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                        </div>:<div className="grid grid-rows-3 w-[10vw] items-center"></div>}
                    </div>
                    {/* Date and PD */}
                    <div className="flex flex-row gap-[1vw] items-center">
                        <div className="flex flex-col w-[20vw]">
                            <span className="font-medium mb-[.25vw]">Date of prescription</span>
                            <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw]" placeholder="dd-mm-yyyy" type="date" value={prescriptionForm.prescriptionDate} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionDate: e.target.value})} />
                        </div>
                        <div className="flex flex-col w-[28vw]">
                            <span className="font-medium mb-[.25vw]">Pupils Distance*</span>
                            {/* 2 PD Numbers checkbox above */}
                            {/* PD row: main PD, Left PD, Right PD */}
                            <div className="flex flex-row gap-[.5vw] items-center">
                                    <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" placeholder="63 (Average/Don`t Know)" type="text" value={prescriptionForm.prescriptionPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionPupilsDistance: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex flex-col w-[28vw]">
                            <label className="flex flex-row items-center gap-1 mb-[.5vw] ml-auto">
                                <input type="checkbox" checked={twoPD} onChange={e => setTwoPD(e.target.checked)} className="accent-primary w-[1vw] h-[1vw]" />
                                <span className="text-xs">2 PD Numbers</span>
                            </label>
                            <div className="flex flex-row gap-[.5vw] items-center">
                                {twoPD && (
                                    <>
                                        <select className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" value={prescriptionForm.prescriptionLeftPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionLeftPupilsDistance: e.target.value})}>
                                            <option value="">Left PD</option>
                                            {Array.from({length: 35}, (_, i) => (23 + i * 0.5).toFixed(1)).map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                        <select className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" value={prescriptionForm.prescriptionRightPupilsDistance} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionRightPupilsDistance: e.target.value})}>
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
                    <div className="flex flex-col mt-[.5vw]">
                        <span className="font-medium mb-[.25vw]">Other Details</span>
                        <textarea className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full resize-none" rows={2} placeholder="Any extra information here that would like us to know - if you need the glasses for reading or distance, or whether your prescription has prism, etc." value={prescriptionForm.prescriptionOtherDetails} onChange={(e) => setPrescriptionForm({...prescriptionForm, prescriptionOtherDetails: e.target.value})} />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex flex-row items-start gap-2 mt-[.5vw]">
                        <input type="checkbox" checked={acceptTC} onChange={e => setAcceptTC(e.target.checked)} className="accent-primary w-[1vw] h-[1vw] mt-[.25vw]" />
                        <span className="text-xs text-[#757575]">I accept the <a className="underline cursor-pointer">Terms & Conditions</a>. I certify that the wearer is over 16 years old and that they are not registered blind or partially sighted. I also confirm that the prescription details above have been entered correctly and I am happy that no errors have been made.</span>
                    </div>

                    {/* Submit Button */}
                    <button disabled={!acceptTC}  type="submit" className="mt-[1vw] w-full py-[.75vw] rounded-[.5vw] bg-darkslategrey text-white font-bold text-lg hover:bg-black transition-colors" onClick={handleSubmit}>Submit Prescription</button>
                </form>
            </div>
                </div>
            );
}