import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { TitleButton, TitleButton2 } from '../../components/button';
import replacementPolicyIcon from '../../assets/images/icons/replacementPolicy.svg';
import deliveryTimeIcon from '../../assets/images/icons/deliveryTime.svg';
import cartProductPlaceholder from '../../assets/images/cartProductPlaceholder.png';
import close from '../../assets/images/icons/close.svg';
import add from '../../assets/images/icons/add.svg';
import subtract from '../../assets/images/icons/subtract.svg';
import axios from 'axios';
import { baseURL } from '@/url';
import { useNavigate } from 'react-router-dom';

export default function Cart(){
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Fetch cart items on component mount
    useEffect(() => {
        fetchCartItems();
    }, [user]);

    const fetchCartItems = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`${baseURL}/api/user/cart/${user._id}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setCartItems(response.data.cart);
                calculateTotalPrice(response.data.cart);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to load cart items');
        }
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => {
            return acc + (item.productId.price * item.quantity);
        }, 0);
        setTotalPrice(total);
    };

    useEffect(() => {
        setFinalPrice(totalPrice + deliveryPrice - discount);
    }, [totalPrice, deliveryPrice, discount]);

    const handleRemoveItem = async (productId) => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/user/cart/remove`, {
                userId: user._id,
                productId
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                // Remove item from local state
                const updatedCart = cartItems.filter(item => item.productId._id !== productId);
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
                // Dispatch custom event for cart update
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            setError('Failed to remove item');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, change) => {
        if (!user) return;

        const item = cartItems.find(item => item.productId._id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;

        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/user/cart/update-quantity`, {
                userId: user._id,
                productId,
                quantity: newQuantity
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                const updatedCart = cartItems.map(item => 
                    item.productId._id === productId 
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                setCartItems(updatedCart);
                calculateTotalPrice(updatedCart);
                // Dispatch custom event for cart update
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            setError('Failed to update quantity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-[#F5F5F5]'>
        <div className='mx-[2vw] bg-white rounded-[2vw]'>
            <div className='flex flex-row items-center mt-[3vw] mb-[4vw]'>
                <h4 className='font-dyeLine font-bold text-h4Text'>Items in your cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})</h4>
                <h5 className='ml-auto font-dyeLine font-bold text-h5Text'>Cart Total: ₹{finalPrice}</h5>
            </div>
            <div className='flex flex-row text-regularText roboto gap-[3.75vw]'>
                <div className='flex flex-col gap-[2vw] w-[57.6875vw] h-[60.375vw] overflow-y-auto hide-scrollbar'>
                    {error && <p className='text-red-500 text-center'>{error}</p>}
                    {cartItems.map((item) => (
                        <div key={item.productId._id} className='flex flex-col gap-[1.5vw]'>  
                            <div className='flex flex-row gap-[1.375vw]'>
                                <img src={item.productId.images[0]} className='w-[17.1875vw] max-w-[275px] max-h-[288px] h-[18vw] rounded-[clamp(0px,1.375vw,22px)]' />
                                <div className='w-full my-[.5vw]'>
                                    <div className='flex flex-row w-auto ml-auto justify-end gap-[.5vw] items-center'>
                                        <p onClick={() => handleRemoveItem(item.productId._id)} className='cursor-pointer font-bold text-[#767676]'>Remove</p>
                                        <img src={close} onClick={() => handleRemoveItem(item.productId._id)} className='cursor-pointer w-[1.25vw] h-[1.25vw]'/>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                        <div>
                                            <p className='font-bold text-h6Text'>{item.productId.modelTitle}</p>
                                            <p className='mt-[.5vw] text-smallText'>{item.productId.modelCode}</p>
                                        </div>
                                        <div>
                                            <p>Quantity</p>
                                            <div className='flex flex-row gap-[.5vw] mt-[.5vw] items-center'>
                                                <img 
                                                    src={subtract} 
                                                    className='cursor-pointer w-[1.5vw] h-[1.5vw]'
                                                    onClick={() => updateQuantity(item.productId._id, -1)}
                                                />
                                                <p className='w-[4vw] text-smallText py-[.1vw] text-center border-black border-[.1vw] rounded-[1.25vw]'>
                                                    {item.quantity}
                                                </p>
                                                <img 
                                                    src={add} 
                                                    className='cursor-pointer max-w-[30px] max-h-[30px] w-[1.5vw] h-[1.5vw]'
                                                    onClick={() => updateQuantity(item.productId._id, 1)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='ml-auto items-center my-auto'>
                                        <p className='font-bold text-h5Text'>₹{item.productId.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                    <span className='ml-auto'>-</span>
                                </div>
                                <br/>
                                <p>Shipping Charges</p>
                            </div>
                            <div className='ml-auto'>
                                <p>₹{totalPrice}</p>
                                <br/>
                                <p>₹{discount}</p>
                                <br/>
                                <p>₹{deliveryPrice}</p>
                            </div>
                        </div>
                        <p className="w-full overflow-hidden whitespace-nowrap">---------------------------------------------------------------------------------------------------------</p>
                        <div className='flex flex-row justify-between'>
                            <div className='w-full'>
                                <p>Total</p>
                            </div>
                            <div className='ml-auto'>
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
                    <TitleButton2 
                        className='mt-[1.25vw] mx-auto bg-black' 
                        btnHeight={3} 
                        btnWidth={30} 
                        btnRadius={2} 
                        btnTitle={loading ? "Processing..." : "Proceed to Checkout"}
                        onClick={() => navigate('/checkout')}
                    />
                    <p className='text-[#767676] font-bold italic text-center'>Adding power and lens options are available at checkout*</p>
                </div>
            </div>
        </div></div>
    );
};
