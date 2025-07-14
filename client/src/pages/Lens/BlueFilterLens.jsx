import React,{useState} from 'react';
import { CartButton } from '../../components/button';
import { LensFeatureBox } from '../../components/lensFeatureBox';
import { formatINR } from '@/components/IntToPrice';

export default function BlueFilterLens({form,setForm,handleFocus,amount,setAmount}) {
    return (
        <div id='blueFilterLensMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Blue Filter Lenses</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
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
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}