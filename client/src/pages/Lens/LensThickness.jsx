import React,{useState} from 'react';
import {LensFeatureBox, PriceBreakdown, formatCoatingLabel} from '../../components/lensFeatureBox';
import { CartButton, ContactUsButton } from '../../components/button';


export default function LensThickness({amount,form,setForm,handleFocus,addProductToCart,setAmount,basePrice=0,coatingPrice=null,setThicknessPrice,isSellable=true,getContactUrl}) {
    const proceedOrContact = (updatedForm, updatedAmount) => {
        if (isSellable) {
            setTimeout(() => addProductToCart(updatedForm, updatedAmount), 0);
        } else {
            window.open(getContactUrl(updatedForm, updatedAmount), '_blank');
        }
    };

    return (
        <div id='lensThicknessMain' className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
            <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Lens Thickness</h1>
            <div className='mx-auto py-[6vw] md:py-[1.5vw] px-[5vw] md:px-[1vw] flex flex-col md:flex-row gap-[6vw] md:gap-[1.5vw] w-full md:w-min'>
                    <LensFeatureBox onclick={()=>{
                        const updatedForm = {...form, lensThickness:"Medium"};
                        setForm(updatedForm);
                        if(setThicknessPrice) setThicknessPrice(0);
                        if(updatedForm.lensType==="Zero Power"){
                            proceedOrContact(updatedForm, amount);
                        } else {
                            handleFocus("prescription");
                        }
                    }} title={"Index: 1.56"} description={"Lightweight and thinner than standard lenses, perfect for moderate prescriptions."} price={0} />
                    {form.lensType!="Bifocal" && <LensFeatureBox onclick={()=>{
                        const updatedForm = {...form, lensThickness:"Thick"};
                        setForm(updatedForm);
                        let newAmount = amount;
                        const thickPrice = form.lensType==="Bifocal" ? 200 : 150;
                        newAmount = amount + thickPrice;
                        setAmount(newAmount);
                        if(setThicknessPrice) setThicknessPrice(thickPrice);
                        if(updatedForm.lensType==="Zero Power"){
                            proceedOrContact(updatedForm, newAmount);
                        } else {
                            handleFocus("prescription");
                        }
                    }} title={"Index: 1.59"} description={"Durable, ultra thin, polycarbonate lenses designed for active lifestyles or rimless frames."}
                    price={form.lensType==="Bifocal"?200:150} />}
            </div>
            <div className='ml-auto mt-[8vw] md:mt-[4vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-[2vw]'>
                <PriceBreakdown
                    base={basePrice}
                    coatingLabel={form.lensCoating ? formatCoatingLabel(form.lensCoating) : null}
                    coatingPrice={form.lensCoating ? coatingPrice : null}
                />
                {form.lensType==="Zero Power" && !isSellable ? (
                    <ContactUsButton href={getContactUrl(form, amount)} />
                ) : (
                    <CartButton/>
                )}
            </div>
        </div>
    )
}
