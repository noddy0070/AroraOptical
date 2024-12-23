import React,{useState} from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import { CartButton } from '../../components/button';


export default function LensCoating({amount, subFocusedCoating, setSubFocusedCoating}) {
    return (
        <div id='lensCoatingMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Lens Coating</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensFeatureBox title={"Clear Vision"} description={"Reduces reflections for sharper, clearer vision in any light."} price={"Free"} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("blueFilter")} title={"Blue Filter"} description={"Protects against harmful blue light, reducing eye strain from screens."} price={"Free"} />
                    <LensFeatureBox onclick={()=>setSubFocusedCoating("lensTint")} title={"Tinted Lenses"} description={"Adds UV protection and a stylish tint for a bold, fashionable look."} price={"Free"} />
                    <LensFeatureBox title={"Photochromatic"} description={"Adapts to light, darkening outdoors and staying clear indoors."} price={"Free"} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {amount}</h5>
                <CartButton/>
              </div>
        </div>
    )
}