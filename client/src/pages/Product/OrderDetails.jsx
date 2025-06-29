import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [order, setOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/order/${orderId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    setTrackingLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/order/${orderId}/track`, {
        withCredentials: true
      });

      if (response.data.success) {
        setTrackingInfo(response.data.trackingInfo);
        if (response.data.order) {
          setOrder(response.data.order);
        }
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      toast.error('Failed to load tracking information');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-lg font-bold mt-2">₹{order.finalAmount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
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
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold">{order.paymentDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.paymentDetails.status)}`}>
                    {order.paymentDetails.status}
                  </span>
                </div>
                {order.paymentDetails.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-sm">{order.paymentDetails.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tracking and Shiprocket Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>₹{order.deliveryCharges}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.finalAmount}</span>
                </div>
              </div>
            </div>

            {/* Shiprocket Tracking */}
            {order.shiprocket.shipmentId && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Delivery Tracking</h2>
                  <button
                    onClick={fetchTrackingInfo}
                    disabled={trackingLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {trackingLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                {/* Shiprocket Details */}
                <div className="space-y-3 mb-4">
                  {order.shiprocket.awbCode && (
                    <div className="flex justify-between">
                      <span className="font-semibold">AWB Number:</span>
                      <span className="font-mono">{order.shiprocket.awbCode}</span>
                    </div>
                  )}
                  {order.shiprocket.courierName && (
                    <div className="flex justify-between">
                      <span>Courier:</span>
                      <span>{order.shiprocket.courierName}</span>
                    </div>
                  )}
                  {order.shiprocket.trackingUrl && (
                    <div className="flex justify-between">
                      <span>Tracking:</span>
                      <a
                        href={order.shiprocket.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Track Package
                      </a>
                    </div>
                  )}
                </div>

                {/* Tracking Updates */}
                {trackingInfo && trackingInfo.data && (
                  <div>
                    <h3 className="font-semibold mb-3">Tracking Updates</h3>
                    <div className="space-y-3">
                      {trackingInfo.data.map((update, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <p className="font-semibold">{update.status}</p>
                          <p className="text-sm text-gray-600">{update.location}</p>
                          <p className="text-xs text-gray-500">{formatDate(update.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Order Notes</h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Orders
          </button>
          {order.status === 'Pending' && (
            <button
              onClick={() => {
                // Implement cancel order functionality
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  // Call cancel order API
                }
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 