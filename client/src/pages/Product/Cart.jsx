import React,{useState} from 'react';
import { TitleButton } from '../../components/button';

export default function Cart(){
    const [cartItems, setCartItems] =useState([
        {
            id:1,
            name:'Product 1',
            price: 100,
            quantity: 1
        },
        {
            id:2,
            name:'Product 2',
            price: 200,
            quantity: 1
        },
        {
            id:3,
            name:'Product 3',
            price: 300,
            quantity: 1
        },
    ]);
    return (
        <div className='mx-[2vw] my-[4vw]'>
            <div className='flex flex-row items-center'>
                <h6 className='font-dyeLine font-bold text-h6Text'>Items in your cart ({cartItems.length})</h6>
                <TitleButton className='ml-auto shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)]' btnHeight={4} btnWidth={15.5} btnRadius={3.125} btnTitle={"Checkout"}/>
            </div>
        </div>
    );
};
