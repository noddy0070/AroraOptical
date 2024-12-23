import React from 'react';
import { CartButton } from '../../components/button';
import { LensTintBox } from '../../components/lensFeatureBox';


export default function LensTint({amount}) {
    return (
        <div id='lensTintMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Blue Filter Lenses</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensTintBox title={"Solid Tint"} description={"Uniform color throughout the lens for a bold, consistent look and UV protection."} price={"Free"} />
                    <LensTintBox title={"Gradient Tint"} description={"A stylish fade from dark to light, offering sun protection with a modern touch."} price={"Free"} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {amount}</h5>
                <CartButton/>
              </div>
        </div>
    )
}