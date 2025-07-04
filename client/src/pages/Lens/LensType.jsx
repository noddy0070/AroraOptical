import React from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';

export default function LensType({amount,form,setForm,handleFocus}) {
    return (
        <div id='lensTypeMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Lens Type</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Zero Power"});handleFocus("lensCoating")}} title={"Zero Power"} description={"Fashion-forward frames with clear lenses—no prescription needed."} price={"Free"} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Single Vision"});handleFocus("lensCoating")}} title={"Single Vision"} description={"Perfect for clear vision at one distance—ideal for reading or distance."} price={"Free"} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Bifocal"});handleFocus("lensCoating")}} title={"Bifocal"} description={"Seamless transition between near and far vision in one lens."} price={"Free"} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {amount}</h5>
                
              </div>
        </div>
    )
}