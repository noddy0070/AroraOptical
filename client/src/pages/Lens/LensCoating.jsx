import React,{useState} from 'react';
import {LensFeatureBox, PriceBreakdown} from '../../components/lensFeatureBox';
import { CartButton } from '../../components/button';

export default function LensCoating({amount,form,setForm,handleFocus, subFocusedCoating, setSubFocusedCoating, setAmount, basePrice=0, setCoatingPrice}) {
    return (
        <div id='lensCoatingMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Lens Coating</h1>
            <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min'>
                    <LensFeatureBox onclick={()=>{
                        setForm({...form,lensCoating:"Clear-Vision"});
                        const price = form.lensType=='Bifocal'?1290:550;
                        setAmount(amount+price);
                        if(setCoatingPrice) setCoatingPrice(price);
                        handleFocus("lensThickness");
                    }} title={"Clear Vision"} description={"Reduces reflections for sharper, clearer vision in any light."} price={form.lensType=='Bifocal'?1290:550} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("blueFilter")} title={"Blue Filter"} description={"Protects against harmful blue light, reducing eye strain from screens."} price={form.lensType=='Bifocal'?1950:1090} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("lensTint")} title={"Tinted Lenses"} description={"Adds UV protection and a stylish tint for a bold, fashionable look."} price={form.lensType=='Bifocal'?1490:1200} />
                    <LensFeatureBox onclick={()=>{
                        setForm({...form,lensCoating:"Photochromatic"});
                        const price = form.lensType=='Bifocal'?1390:1250;
                        setAmount(amount+price);
                        if(setCoatingPrice) setCoatingPrice(price);
                        handleFocus("lensThickness");
                    }} title={"Photochromatic"} description={"Adapts to light, darkening outdoors and staying clear indoors."} price={form.lensType=='Bifocal'?1390:1250} />
            </div>
            <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-[2vw]'>
                <PriceBreakdown base={basePrice} />
                <CartButton/>
            </div>
        </div>
    )
}
