import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';
import { TitleButton } from '@/components/button';

const Checkout = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [serviceability, setServiceability] = useState(null);
  const [checkingServiceability, setCheckingServiceability] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipcode: user?.zipcode || '',
    phone: user?.number || '',
    email: user?.email || ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    method: 'COD',
    status: 'Pending'
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    deliveryCharges: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/user/cart/${user._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart);
        calculateOrderSummary(response.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    }
  };

  const calculateOrderSummary = (items) => {
    const subtotal = items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const deliveryCharges = 0; // Will be calculated based on serviceability
    const discount = 0; // Can be added later
    const total = subtotal + tax + deliveryCharges - discount;

    setOrderSummary({
      subtotal,
      tax,
      deliveryCharges,
      discount,
      total
    });
  };

  const checkServiceability = async () => {
    if (!shippingAddress.zipcode) {
      toast.error('Please enter delivery pincode');
      return;
    }

    setCheckingServiceability(true);
    try {
      const response = await axios.get(`${baseURL}/api/order/serviceability`, {
        params: {
          pickupPincode: '110001', // Your store pincode
          deliveryPincode: shippingAddress.zipcode,
          weight: 0.5
        }
      });

      if (response.data.success) {
        setServiceability(response.data.serviceability);
        // Update delivery charges based on available couriers
        if (response.data.serviceability.data && response.data.serviceability.data.length > 0) {
          const cheapestCourier = response.data.serviceability.data[0];
          setOrderSummary(prev => ({
            ...prev,
            deliveryCharges: cheapestCourier.rate,
            total: prev.subtotal + prev.tax + cheapestCourier.rate - prev.discount
          }));
        }
      }
    } catch (error) {
      console.error('Serviceability check error:', error);
      toast.error('Failed to check delivery availability');
    } finally {
      setCheckingServiceability(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentDetails(prev => ({
      ...prev,
      method
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'address', 'city', 'state', 'zipcode', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    if (!serviceability) {
      toast.error('Please check delivery availability first');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),
        shippingAddress,
        paymentDetails,
        deliveryCharges: orderSummary.deliveryCharges,
        notes: ''
      };

      const response = await axios.post(`${baseURL}/api/order/create`, orderData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate(`/order/${response.data.order._id}`);
      }
    } catch (error) {
      console.error('Place order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId._id} className="flex items-center space-x-4">
                    <img 
                      src={item.productId.images[0]} 
                      alt={item.productId.modelName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productId.modelName}</h3>
                      <p className="text-gray-600">{item.productId.modelCode}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.productId.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{orderSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{orderSummary.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>₹{orderSummary.deliveryCharges}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{orderSummary.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{orderSummary.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipcode}
                    onChange={(e) => handleAddressChange('zipcode', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={checkServiceability}
                    disabled={checkingServiceability || !shippingAddress.zipcode}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {checkingServiceability ? 'Checking...' : 'Check Delivery'}
                  </button>
                </div>
              </div>

              {/* Serviceability Results */}
              {serviceability && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Delivery Available</h3>
                  {serviceability.data && serviceability.data.length > 0 && (
                    <div className="space-y-2">
                      {serviceability.data.slice(0, 3).map((courier, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{courier.courier_name}</span>
                          <span>₹{courier.rate} - {courier.etd} days</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentDetails.method === 'COD'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentDetails.method === 'Online'}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Online Payment (Credit/Debit Card, UPI)</span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={placeOrder}
                disabled={loading || !serviceability}
                className="w-full bg-black text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${orderSummary.total}`}
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 