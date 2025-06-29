import { useState } from 'react';

export default function PrescriptionForm() {
    const [twoPD, setTwoPD] = useState(false);
    const [acceptTC, setAcceptTC] = useState(false);

    return (
        <div id='prescriptionFormMain' className=''>
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Enter Prescription</h1>
            <div className='mx-auto py-[1vw] px-[1vw] w-[69.75vw] flex flex-col gap-[1vw] font-roboto text-regularText'>
                <p className="text-center">
                    We strongly recommend you to <a className="underline cursor-pointer text-primary">Upload a Photo</a> of your prescription. It's simple and eliminates any chances for Errors.
                </p>
                <form className="px-[1.125vw] flex flex-col gap-[1vw]">
                    {/* Prescription Name and Date */}
                        <input className="mb-[-1.5vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" placeholder="Enter Prescription Name" />

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
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">+/-</option>
                                {Array.from({length: 81}, (_, i) => (i - 40) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select  className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">+/-</option>
                                {Array.from({length: 81}, (_, i) => (i - 40) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Cylinder */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Cylinder(CYL)</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">+/-</option>
                                {Array.from({length: 81}, (_, i) => (i - 40) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">+/-</option>
                                {Array.from({length: 81}, (_, i) => (i - 40) * 0.25).map(val => (
                                    <option key={val} value={val.toFixed(2)}>{val > 0 ? "+" : ""}{val.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>
                        {/* Axis */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Axis</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">Right Axis</option>
                                {Array.from({length: 180}, (_, i) => i + 1).map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">Left Axis</option>
                                {Array.from({length: 180}, (_, i) => i + 1).map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                        {/* Near(ADD) */}
                        <div className="grid grid-rows-3 w-[10vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Near(ADD)</span>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">--</option>
                                {Array.from({length: 15}, (_, i) => (i * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                            <select className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]">
                                <option value="">--</option>
                                {Array.from({length: 15}, (_, i) => (i * 0.25).toFixed(2)).map(val => (
                                    <option key={val} value={val}>+{val}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Date and PD */}
                    <div className="flex flex-row gap-[1vw] items-center">
                        <div className="flex flex-col w-[20vw]">
                            <span className="font-medium mb-[.25vw]">Date of prescription</span>
                            <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw]" placeholder="dd-mm-yyyy" type="date" />
                        </div>
                        <div className="flex flex-col w-[28vw]">
                            <span className="font-medium mb-[.25vw]">Pupils Distance*</span>
                            {/* 2 PD Numbers checkbox above */}
                            
                            {/* PD row: main PD, Left PD, Right PD */}
                            <div className="flex flex-row gap-[.5vw] items-center">
                                <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" placeholder="63 (Average/Don`t Know)" type="text" disabled={twoPD} />
                                
                            </div>
                        </div>
                        <div className="flex flex-col w-[28vw]">
                        <label className="flex flex-row items-center gap-1 mb-[.5vw] ml-auto">
                                <input type="checkbox" checked={twoPD} onChange={e => setTwoPD(e.target.checked)} className="accent-primary w-[1vw] h-[1vw]" />
                                <span className="text-xs">2 PD Numbers</span>
                                
                            </label>
                            <div className="flex flex-row gap-[.5vw] items-center">
                            <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" placeholder="Left PD" type="text" disabled={!twoPD} />
                                <input className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full" placeholder="Right PD" type="text" disabled={!twoPD} />
                                </div>
                        </div>
                    </div>

                    {/* Other Details */}
                    <div className="flex flex-col mt-[.5vw]">
                        <span className="font-medium mb-[.25vw]">Other Details</span>
                        <textarea className="py-[.625vw] px-[1vw] border-[1px] border-black rounded-[.5vw] w-full resize-none" rows={2} placeholder="Any extra information here that would like us to know - if you need the glasses for reading or distance, or whether your prescription has prism, etc." />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex flex-row items-start gap-2 mt-[.5vw]">
                        <input type="checkbox" checked={acceptTC} onChange={e => setAcceptTC(e.target.checked)} className="accent-primary w-[1vw] h-[1vw] mt-[.25vw]" />
                        <span className="text-xs text-[#757575]">I accept the <a className="underline cursor-pointer">Terms & Conditions</a>. I certify that the wearer is over 16 years old and that they are not registered blind or partially sighted. I also confirm that the prescription details above have been entered correctly and I am happy that no errors have been made.</span>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="mt-[1vw] w-full py-[.75vw] rounded-[.5vw] bg-darkslategrey text-white font-bold text-lg hover:bg-black transition-colors">Submit Prescription</button>
                </form>
            </div>
        </div>
    );
}