import React from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import { formatINR } from '@/components/IntToPrice';

export default function LensType({amount,form,setForm,handleFocus}) {
    return (
        <div id='lensTypeMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Lens Type</h1>
            <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min overflow-x-auto hide-scrollbar md:overflow-visible'>
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Zero Power"});handleFocus("lensCoating")}} title={"Zero Power"} description={"Fashion-forward frames with clear lenses—no prescription needed."} price={-1} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Single Vision"});handleFocus("lensCoating")}} title={"Single Vision"} description={"Perfect for clear vision at one distance—ideal for reading or distance."} price={-1} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensType:"Bifocal"});handleFocus("lensCoating")}} title={"Bifocal"} description={"Seamless transition between near and far vision in one lens."} price={-1} />
            </div>
            <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start'>
                <h5 className='text-h5TextPhone md:text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                
              </div>
        </div>
    )
}