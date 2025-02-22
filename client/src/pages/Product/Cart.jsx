import React,{useState,useEffect} from 'react';
import { TitleButton, TitleButton2 } from '../../components/button';
import replacementPolicyIcon from '../../assets/images/icons/replacementPolicy.svg';
import deliveryTimeIcon from '../../assets/images/icons/deliveryTime.svg';
import cartProductPlaceholder from '../../assets/images/cartProductPlaceholder.png';
import close from '../../assets/images/icons/close.svg';
import add from '../../assets/images/icons/add.svg';
import subtract from '../../assets/images/icons/subtract.svg';

export default function Cart(){
    const [cartItems, setCartItems] =useState([
        {
            id:1,
            name:'Product 1',
            model:'Model Number',
            price: 100,
            quantity: 1,
            img:cartProductPlaceholder
        },
        {
            id:2,
            name:'Product 2',
            model:'Model Number',
            price: 200,
            quantity: 1,
            img:cartProductPlaceholder
        },
        {
            id:3,
            name:'Product 3',
            model:'Model Number',
            price: 300,
            quantity: 1,
            img:cartProductPlaceholder
        },
    ]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(100);
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    useEffect(() => {
        console.log("cartItems updated:", cartItems); // Debugging log
      
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
      }, [cartItems]);
      
      useEffect(() => {
        setFinalPrice((prev) => {
          console.log("Previous Final Price:", prev);
          console.log("New Final Price Calculation:", totalPrice + deliveryPrice + discount);
          return totalPrice + deliveryPrice + discount;
        });
      }, [totalPrice, deliveryPrice, discount]);
      
    

    const updateCart = (id, change) => {
        setCartItems((prevCartItems) => {
          const updatedCart = prevCartItems.map((cartItem) =>
            cartItem.id === id
              ? { ...cartItem, quantity: cartItem.quantity + change }
              : cartItem
          );
      
          // Force re-calculation by updating total after cart update
          const newTotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
          setTotalPrice(newTotal);
      
          return updatedCart;
        });
      };
      
console.log(cartItems);
  
    return (
        <div className='mx-[2vw]'>
            <div className='flex flex-row items-center mt-[3vw] mb-[4vw]'>
                <h4 className='font-dyeLine font-bold text-h4Text'>Items in your cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})</h4>
                <h5 className='ml-auto font-dyeLine font-bold text-h5Text'>Cart Total: ₹{finalPrice}</h5>
                {/* <TitleButton className='ml-auto shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)]' btnHeight={4} btnWidth={15.5} btnRadius={3.125} btnTitle={"Checkout"}/> */}
            </div>
            <div className='flex flex-row text-regularText roboto gap-[3.75vw]'>
                <div className='flex flex-col gap-[2vw] w-[57.6875vw] h-[60.375vw] overflow-y-auto hide-scrollbar'>
                    {cartItems.map((item) => {
                            return(
                                <div className='flex flex-col gap-[1.5vw]'>  
                                    <div className='flex flex-row gap-[1.375vw]'>
                                        <img src={item.img} className='w-[17.1875vw] max-w-[275px] max-h-[288px] h-[18vw] rounded-[clamp(0px,1.375vw,22px)]' />
                                        <div className='w-full my-[.5vw] '>
                                            <div className='flex flex-row w-auto ml-auto justify-end gap-[.5vw]  items-center' >
                                                <p className='cursor-pointer font-bold text-[#767676]'>Remove</p>
                                                <img src={close} className='cursor-pointer w-[1.25vw] h-[1.25vw]'/>
                                            </div>
                                            <div className='flex flex-row justify-between'>
                                                
                                            <div className=' justify-center flex flex-col gap-[1vw]'>
                                                <div>
                                                    <p className='font-bold text-h6Text '>{item.name}</p>
                                                    <p className='mt-[.5vw] text-smallText'>{item.model}</p>
                                                </div>
                                                <p className='text-smallText'>varient . Size</p>
                                                <div>
                                                    <p>Quantity</p>
                                                    <div className='flex flex-row gap-[.5vw] mt-[.5vw] items-center'>
                                                        <img src={subtract} className='cursor-pointer w-[1.5vw] h-[1.5vw]' 
                                                        onClick={() => item.quantity > 1 && updateCart(item.id, -1)}/>
                                                        <p className='w-[4vw]  text-smallText py-[.1vw] text-center border-black border-[.1vw] rounded-[1.25vw]'>{item.quantity}</p>
                                                        <img src={add} className='cursor-pointer max-w-[30px] max-h-[30px]  w-[1.5vw] h-[1.5vw]' 
                                                    onClick={() => updateCart(item.id, 1)}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='ml-auto items-center my-auto'>
                                                <p className='font-bold text-h5Text'>₹{item.price*item.quantity}</p>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                        <div className='my-[1.5vw]'>

                                        </div>
                    </div>
                            )
                    })}
                    
                </div>
                <div className='flex flex-col gap-[1.25vw] w-[34.5625vw] pr-[3.625vw]'>
                    <p className='font-bold text-mediumText'>Order Summary</p>
                    <div className='flex flex-col font-medium justify-between'>
                        <div className='flex flex-row justify-between'>
                        <div className='w-full'>
                            <p>MRP (Incl. Tax)</p>
                            <br/>
                            <div className='flex flex-row w-full'>
                            <p>Discount</p>
                            <span className='ml-auto'>-  </span>
                            </div>
                            <br/>
                            <p>Shipping Charges</p>
                        </div>
                        <div className='ml-auto '>
                            <p className=''>₹{totalPrice}</p>
                            <br/>
                            <p> ₹{discount}</p>
                            <br/>
                            <p>₹{deliveryPrice}</p>
                        </div>
                        </div>
                        <p className=" w-full overflow-hidden whitespace-nowrap"> ---------------------------------------------------------------------------------------------------------</p>
                        <div className='flex flex-row justify-between'>
                        <div className='w-full'>
                            <p>Total</p>
                        </div>
                        <div className='ml-auto '>
                            <p>₹{finalPrice}</p>
                        </div>
                        </div>


                    </div>
                    <div className='flex flex-row justify-between mx-auto w-[23.1875vw]'>
                        <div className='flex flex-col text-center'>
                            <img className='w-[4vw] max-w-[64px] max-h-[64px] h-[4vw] mx-auto' src={replacementPolicyIcon}/>
                            <p className='whitespace-nowrap'>10 Days Replacement Policy</p>
                        </div>
                        <div className='flex flex-col text-center'>
                            <img className='w-[4vw] h-[4vw] max-w-[64px] max-h-[64px] mx-auto' src={deliveryTimeIcon}/>
                            <p className='whitespace-nowrap'>Fast Delivery</p>
                        </div>

                    </div>
                    <TitleButton2 className='mt-[1.25vw] mx-auto bg-black' btnHeight={3} btnWidth={30} btnRadius={2} btnTitle={"Proceed to Checkout"}/>
                    <p className='text-[#767676] font-bold italic text-center'>Adding power and lens options are available at checkout*</p>
                </div>

            </div>
        </div>
    );
};
