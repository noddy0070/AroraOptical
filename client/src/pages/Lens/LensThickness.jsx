import React,{useState} from 'react';
import {LensFeatureBox} from '../../components/lensFeatureBox';
import { CartButton } from '../../components/button';
import { formatINR } from '@/components/IntToPrice';


export default function LensThickness({amount,form,setForm,handleFocus,addProductToCart,setAmount}) {
    return (
        <div id='lensThicknessMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Lens Thickness</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw] flex flex-row gap-[1.5vw] w-min'>
                    <LensFeatureBox onclick={()=>{
                        const updatedForm = {...form, lensThickness:"Thin"};
                        setForm(updatedForm);
                        console.log("Setting lensThickness to Thin:", updatedForm);
                        if(updatedForm.lensType==="Zero Power"){
                            setTimeout(() => addProductToCart(updatedForm), 0);
                        } else {
                            handleFocus("prescription");
                        }
                    }} title={"Index: 1.50"} description={"Standard lenses offering reliable clarity—ideal for low prescriptions."} price={0} />
                    <LensFeatureBox onclick={()=>{
                        const updatedForm = {...form, lensThickness:"Medium"};
                        setForm(updatedForm);
                        console.log("Setting lensThickness to Medium:", updatedForm);
                        if(updatedForm.lensType==="Zero Power"){
                            setTimeout(() => addProductToCart(updatedForm), 0);
                        } else {
                            handleFocus("prescription");
                        }
                    }} title={"Index: 1.56"} description={"Lightweight and thinner than standard lenses, perfect for moderate prescriptions."} price={0} />
                    <LensFeatureBox onclick={()=>{
                        const updatedForm = {...form, lensThickness:"Thick"};
                        setForm(updatedForm);
                        console.log("Setting lensThickness to Thick:", updatedForm);
                        let newAmount = amount;
                        if(form.lensCoating==="Blue-Filter/Green" || form.lensCoating==="Blue-Filter/Blue" || form.lensCoating==="Blue-Filter/Mixed"){
                            newAmount = amount + 200;
                            setAmount(newAmount);
                        } else if(form.lensCoating==="Photochromatic"){
                            newAmount = amount + 150;
                            setAmount(newAmount);
                        }
                        if(updatedForm.lensType==="Zero Power"){
                            setTimeout(() => addProductToCart(updatedForm, newAmount), 0);
                        } else {
                            handleFocus("prescription");
                        }
                    }} title={"Index: 1.59"} description={"Durable, ultra thin, polycarbonate lenses designed for active lifestyles or rimless frames."} 
                    price={form.lensCoating==="Blue-Filter/Green" || form.lensCoating==="Blue-Filter/Blue" || form.lensCoating==="Blue-Filter/Mixed"?200:form.lensCoating==="Photochromatic"?150:0} />
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                <h5 className='text-h5Text font-dyeLine font-bold'>Total Amount: {formatINR(amount)}</h5>
                <CartButton/>
              </div>
        </div>
    )
}