import React from 'react';
import { CartButton } from '../../components/button';
import { LensTintBox } from '../../components/lensFeatureBox';
import { formatINR } from '@/components/IntToPrice';

export default function LensTint({amount,form,setForm,handleFocus,setAmount}) {
    return (
        <div id='lensTintMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Blue Filter Lenses</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensTintBox handleFocus={handleFocus} form={form} setForm={setForm} title={"Solid Tint"} description={"Uniform color throughout the lens for a bold, consistent look and UV protection."} price={form.lensType=='Bifocal'?1490:1200} setAmount={setAmount} amount={amount} />
                    <LensTintBox handleFocus={handleFocus} form={form} setForm={setForm} title={"Gradient Tint"} description={"A stylish fade from dark to light, offering sun protection with a modern touch."} price={form.lensType=='Bifocal'?1590:1300} setAmount={setAmount} amount={amount} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}