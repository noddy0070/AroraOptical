import React from 'react';
import {LensFeatureBox, PriceBreakdown, formatCoatingLabel} from '../../components/lensFeatureBox';
import newPrescriptionImg from '../../assets/images/lensPage/newPrescription.png';
import savedPrescriptionImg from '../../assets/images/lensPage/savedPrescription.png';
import uploadPrescriptionImg from '../../assets/images/lensPage/uploadPrescription.png';
import { CartButton } from '../../components/button';

export default function Prescription({form,setForm,handleFocus,setSubFocusedPrescription,basePrice=0,coatingPrice=null,thicknessPrice=null}){
    return (
        <div id='prescriptionMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
                    <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Prescription</h1>
                    <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min overflow-x-auto hide-scrollbar md:overflow-visible'>
                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("savedPrescription")} img={savedPrescriptionImg} title={"Saved Prescription"} description={"Use your previously saved prescription for a quick and easy order."} price={-1} classNameLearnMore='hidden' />

                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("newPrescription")} img={newPrescriptionImg} title={"Add New Prescription"} description={"Enter your updated prescription details for the perfect lenses."} price={-1} classNameLearnMore='hidden'/>
                            <LensFeatureBox onclick={()=>setSubFocusedPrescription("uploadPrescription")} img={uploadPrescriptionImg} title={"Upload a Photo"} description={<span>Simply upload a photo of your prescription for hassle-free ordering.(Strongly Recommended) </span>} price={-1} classNameLearnMore='hidden'/>
                    </div>
                    <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-[2vw]'>
                        <PriceBreakdown
                            base={basePrice}
                            coatingLabel={form.lensCoating ? formatCoatingLabel(form.lensCoating) : null}
                            coatingPrice={form.lensCoating ? coatingPrice : null}
                            thicknessLabel={form.lensThickness || null}
                            thicknessPrice={form.lensThickness ? thicknessPrice : null}
                        />
                        <CartButton/>
                      </div>
                </div>
    )
}