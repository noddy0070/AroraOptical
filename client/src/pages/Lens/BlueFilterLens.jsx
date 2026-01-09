import React,{useState} from 'react';
import { CartButton } from '../../components/button';
import { LensFeatureBox } from '../../components/lensFeatureBox';
import { formatINR } from '@/components/IntToPrice';

export default function BlueFilterLens({form,setForm,handleFocus,amount,setAmount}) {
    return (
        <div id='blueFilterLensMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Blue Filter Lenses</h1>
            <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min overflow-x-auto hide-scrollbar md:overflow-visible'>
                    <LensFeatureBox onclick={()=>{setForm({...form,lensCoating:"Blue-Filter/Green"});
                    form.lensType=='Bifocal'?setAmount(amount+1950) :setAmount(amount+1090);
                    handleFocus("lensThickness")}} title={"Green Coat"} description={"Reduces glare and enhances clarity while blocking harmful blue light."} price={form.lensType=='Bifocal'?1950:1090} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensCoating:"Blue-Filter/Blue"});
                    form.lensType=='Bifocal'?setAmount(amount+1950) :setAmount(amount+1090);
                    handleFocus("lensThickness")}} title={"Blue Coat"} description={"Specifically designed to filter blue light, offering better eye comfort during screen use."} price={form.lensType=='Bifocal'?1950:1090} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensCoating:"Blue-Filter/Mixed"});
                    form.lensType=='Bifocal'?setAmount(amount+1950) :setAmount(amount+1090);
                    handleFocus("lensThickness")}} title={"Mixed Coat"} description={"A balanced combination of blue and green coatings for superior protection and clarity."} price={form.lensType=='Bifocal'?1950:1090} />
            </div>
            <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-0'>
                <h5 className='text-h5TextPhone md:text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}