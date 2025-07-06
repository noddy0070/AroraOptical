import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import replacementPolicyIcon from '../../assets/images/icons/replacementPolicy.svg';
import deliveryTimeIcon from '../../assets/images/icons/deliveryTime.svg';
import axios from 'axios';
import { baseURL } from '@/url';
import { useNavigate } from 'react-router-dom';
import CartOrderSummary from './CartOrderSummary';
import CartItem from './CartItem';
import { formatINR } from '@/components/IntToPrice';

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
    console.log(cartItems);

    return (
        <div className='bg-[#F5F5F5]'>
        <div className='mx-[2vw] bg-white rounded-[2vw] p-[2vw] mt-[3vw]'>
            <div className='flex flex-row items-center mb-[2vw]'>
                <h4 className='font-dyeLine font-bold text-h4Text'>Items in your cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})</h4>
                <h5 className='ml-auto font-dyeLine font-bold text-h5Text'>Cart Total: {formatINR(finalPrice)}</h5>
            </div>
            <div className='flex flex-row text-regularText roboto gap-[3.75vw]'>
                <div className='flex flex-col gap-[2vw] w-[57.6875vw]  overflow-y-auto hide-scrollbar'>
                    {error && <p className='text-red-500 text-center'>{error}</p>}
                    {cartItems.map((item) => (
                        <CartItem key={item.productId._id} item={item} handleRemoveItem={handleRemoveItem} updateQuantity={updateQuantity}/>
                    ))}
                </div>
                <CartOrderSummary cartItems={cartItems} totalPrice={totalPrice} discount={discount} deliveryPrice={deliveryPrice} finalPrice={finalPrice} replacementPolicyIcon={replacementPolicyIcon} deliveryTimeIcon={deliveryTimeIcon} loading={loading}/>
            </div>
        </div></div>
    );
};
