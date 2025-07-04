import React,{useState} from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import newPrescriptionImg from '../../assets/images/lensPage/newPrescription.png';
import savedPrescriptionImg from '../../assets/images/lensPage/savedPrescription.png';
import uploadPrescriptionImg from '../../assets/images/lensPage/uploadPrescription.png';
import { CartButton } from '../../components/button';

export default function Prescription({form,setForm,amount,setSubFocusedPrescription}){
    return (
        <div id='prescriptionMain' className='' >
                    <h1 className='font-bold font-dyeLine text-h1Text text-center'>Prescription</h1>
                    <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("savedPrescription")} img={savedPrescriptionImg} title={"Saved Prescription"} description={"Use your previously saved prescription for a quick and easy order."} price={"Free"} classNameLearnMore='hidden' />
                            
                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("newPrescription")} img={newPrescriptionImg} title={"Add New Prescription"} description={"Enter your updated prescription details for the perfect lenses."} price={"Free"} classNameLearnMore='hidden'/>
                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("uploadPrescription")} img={uploadPrescriptionImg} title={"Upload a Photo"} description={<span>Simply upload a photo of your prescription for hassle-free ordering.(Strongly Recommended) </span>} price={"Free"} classNameLearnMore='hidden'/>
                    </div>
                    <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                        <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {amount}</h5>
                        <CartButton/>
                      </div>
                </div>
    )
}