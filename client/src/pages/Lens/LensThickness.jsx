import React,{useState} from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import { CartButton } from '../../components/button';


export default function LensThickness({amount,form,setForm,handleFocus}) {
    return (
        <div id='lensThicknessMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Lens Thickness</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensFeatureBox onclick={()=>{setForm({...form,lensThickness:"Thin"});form.lensType==="Zero Power"?<></>:handleFocus("prescription")}} title={"Index: 1.50"} description={"Standard lenses offering reliable clarity—ideal for low prescriptions."} price={"Free"} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensThickness:"Medium"});form.lensType==="Zero Power"?<></>:handleFocus("prescription")}} title={"Index: 1.56"} description={"Lightweight and thinner than standard lenses, perfect for moderate prescriptions."} price={"Free"} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensThickness:"Thick"});form.lensType==="Zero Power"?<></>:handleFocus("prescription")}} title={"Index: 1.59"} description={"Durable, ultra thin, polycarbonate lenses designed for active lifestyles or rimless frames."} price={"Free"} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {amount}</h5>
                <CartButton/>
              </div>
        </div>
    )
}