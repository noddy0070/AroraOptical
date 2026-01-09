import React from 'react';
import { CartButton } from '../../components/button';
import { LensTintBox } from '../../components/lensFeatureBox';
import { formatINR } from '@/components/IntToPrice';

export default function LensTint({amount,form,setForm,handleFocus,setAmount}) {
    return (
        <div id='lensTintMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Tinted Lenses</h1>
            <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min overflow-x-auto hide-scrollbar md:overflow-visible'>
                    <LensTintBox handleFocus={handleFocus} form={form} setForm={setForm} title={"Solid Tint"} description={"Uniform color throughout the lens for a bold, consistent look and UV protection."} price={form.lensType=='Bifocal'?1490:1200} setAmount={setAmount} amount={amount} />
                    <LensTintBox handleFocus={handleFocus} form={form} setForm={setForm} title={"Gradient Tint"} description={"A stylish fade from dark to light, offering sun protection with a modern touch."} price={form.lensType=='Bifocal'?1590:1300} setAmount={setAmount} amount={amount} />
            </div>
            <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-0'>
                <h5 className='text-h5TextPhone md:text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}