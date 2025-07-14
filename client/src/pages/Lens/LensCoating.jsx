import React,{useState} from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import { CartButton } from '../../components/button';
import { formatINR } from '@/components/IntToPrice';

export default function LensCoating({amount,form,setForm,handleFocus, subFocusedCoating, setSubFocusedCoating, setAmount}) {
    return (
        <div id='lensCoatingMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Lens Coating</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensFeatureBox onclick={()=>{setForm({...form,lensCoating:"Clear-Vision"});
                    form.lensType=='Bifocal'?setAmount(amount+1290) :setAmount(amount+550);
                    handleFocus("lensThickness")}} title={"Clear Vision"} description={"Reduces reflections for sharper, clearer vision in any light."} price={form.lensType=='Bifocal'?1290:550} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("blueFilter")} title={"Blue Filter"} description={"Protects against harmful blue light, reducing eye strain from screens."} price={form.lensType=='Bifocal'?1950:1090} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("lensTint")} title={"Tinted Lenses"} description={"Adds UV protection and a stylish tint for a bold, fashionable look."} price={form.lensType=='Bifocal'?1490:1200} />
                    <LensFeatureBox onclick={()=>{setForm({...form,lensCoating:"Photochromatic"});
                    form.lensType=='Bifocal'?setAmount(amount+1390) :setAmount(amount+1250);
                    handleFocus("lensThickness")}} title={"Photochromatic"} description={"Adapts to light, darkening outdoors and staying clear indoors."} price={form.lensType=='Bifocal'?1390:1250} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}