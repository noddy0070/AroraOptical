import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';
import { toTitleCase } from '../../../shared/pipes/strFormatting';

const fmtRx = (v) => {
  if (v == null) return '—';
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
};

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
        <div className="animate-spin rounded-full h-[12vw] md:h-12 w-[12vw] md:w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-[5vw] md:px-0">
        <div className="text-center">
          <h2 className="text-h3TextPhone md:text-2xl font-bold mb-[4vw] md:mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-black text-white px-[6vw] md:px-6 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg text-regularTextPhone md:text-regularText"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-[6vw] md:py-8">
      <div className="max-w-4xl mx-auto px-[5vw] md:px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6 mb-[6vw] md:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[3vw] md:gap-0">
            <div>
              <h1 className="text-h3TextPhone md:text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
              <p className="text-regularTextPhone md:text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-left md:text-right">
              <span className={`px-[3vw] md:px-3 py-[1vw] md:py-1 rounded-full text-smallTextPhone md:text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-h5TextPhone md:text-lg font-bold mt-[2vw] md:mt-2">₹{order.finalAmount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[6vw] md:gap-6">
          {/* Order Details */}
          <div className="space-y-[6vw] md:space-y-6">
            {/* Products */}
            <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
              <h2 className="text-h4TextPhone md:text-xl font-bold mb-[4vw] md:mb-4">Order Items</h2>
              <div className="space-y-[6vw] md:space-y-6">
                {order.products.map((item, index) => {
                  const snap = item.productSnapshot || {};
                  const lens = item.lensOptions || {};
                  const hasLens = lens.lensType && lens.lensType !== 'None';
                  const rx = item.prescriptionId;
                  const modelName  = snap.modelName  || item.productId?.modelName;
                  const modelCode  = snap.modelCode  || item.productId?.modelCode;
                  const image      = snap.images?.[0] || item.productId?.images?.[0];
                  return (
                    <div key={index} className="border border-gray-100 rounded-[3vw] md:rounded-xl overflow-hidden">
                      {/* Product row */}
                      <div className="flex flex-row items-center gap-[3vw] md:gap-4 p-[3vw] md:p-4">
                        <Link to={`/product/${item.productId?._id}`} className="shrink-0" onClick={e => e.stopPropagation()}>
                          <img
                            src={image}
                            alt={modelName}
                            className="w-[18vw] h-[18vw] md:w-16 md:h-16 object-cover rounded-[2vw] md:rounded-lg hover:opacity-80 transition-opacity"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.productId?._id}`}
                            className="font-semibold text-regularTextPhone md:text-regularText hover:text-indigo-600 hover:underline underline-offset-2 transition-colors"
                          >
                            {modelName}
                          </Link>
                          {modelCode && <p className="text-smallTextPhone md:text-sm text-gray-500">{modelCode}</p>}
                          <p className="text-tinyTextPhone md:text-xs text-gray-400 mt-[1vw] md:mt-0.5">Qty: {item.quantity}</p>
                          {item.size && (
                            <p className="text-tinyTextPhone md:text-xs text-gray-400">Size: {item.size}</p>
                          )}
                        </div>
                        <p className="font-semibold text-regularTextPhone md:text-regularText shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      {/* Lens options */}
                      {hasLens && (
                        <div className="border-t border-gray-100 bg-gray-50 px-[3vw] md:px-4 py-[3vw] md:py-3">
                          <p className="text-[2.5vw] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-[2vw] md:mb-2">Lens Selection</p>
                          <div className="flex flex-wrap gap-[2vw] md:gap-2">
                            {lens.lensType && lens.lensType !== 'None' && (
                              <span className="text-[2.8vw] md:text-xs bg-blue-50 text-blue-700 border border-blue-200 px-[2vw] md:px-2.5 py-[.8vw] md:py-1 rounded-full font-medium">
                                {lens.lensType}
                              </span>
                            )}
                            {lens.lensCoating && lens.lensCoating !== 'None' && (
                              <span className="text-[2.8vw] md:text-xs bg-purple-50 text-purple-700 border border-purple-200 px-[2vw] md:px-2.5 py-[.8vw] md:py-1 rounded-full font-medium">
                                {lens.lensCoating}
                              </span>
                            )}
                            {lens.lensThickness && lens.lensThickness !== 'None' && (
                              <span className="text-[2.8vw] md:text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-[2vw] md:px-2.5 py-[.8vw] md:py-1 rounded-full font-medium">
                                {lens.lensThickness} thickness
                              </span>
                            )}
                            {lens.lensTint && lens.lensTint !== 'None' && (
                              <span className="text-[2.8vw] md:text-xs bg-orange-50 text-orange-700 border border-orange-200 px-[2vw] md:px-2.5 py-[.8vw] md:py-1 rounded-full font-medium">
                                {lens.lensTint} tint
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Prescription */}
                      {rx && (
                        <div className="border-t border-gray-100 bg-gray-50/60 px-[3vw] md:px-4 py-[3vw] md:py-3">
                          <p className="text-[2.5vw] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-[2vw] md:mb-2">Prescription</p>
                          <div className="flex flex-wrap gap-[3vw] md:gap-4 text-[2.8vw] md:text-xs text-gray-500 mb-[2vw] md:mb-3">
                            <span>Name: <span className="font-semibold text-gray-700">{rx.prescriptionName}</span></span>
                            <span>Date: <span className="font-semibold text-gray-700">{rx.prescriptionDate}</span></span>
                            {rx.source && <span>Source: <span className="font-semibold text-gray-700">{rx.source}</span></span>}
                            {rx.pupillaryDistance?.main && <span>PD: <span className="font-semibold text-gray-700">{rx.pupillaryDistance.main}</span></span>}
                          </div>
                          {(rx.rightEye?.sphere != null || rx.leftEye?.sphere != null) && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-[2.5vw] md:text-xs border-collapse">
                                <thead>
                                  <tr className="bg-gray-100 text-gray-500">
                                    <th className="text-left px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold rounded-tl-lg"></th>
                                    <th className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold">SPH</th>
                                    <th className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold">CYL</th>
                                    <th className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold">AXIS</th>
                                    <th className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold rounded-tr-lg">ADD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[['Right (OD)', rx.rightEye], ['Left (OS)', rx.leftEye]].map(([label, eye]) => (
                                    <tr key={label} className="border-t border-gray-100">
                                      <td className="px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 font-semibold text-gray-700">{label}</td>
                                      <td className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 text-gray-600">{fmtRx(eye?.sphere)}</td>
                                      <td className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 text-gray-600">{fmtRx(eye?.cylinder)}</td>
                                      <td className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 text-gray-600">{eye?.axis ?? '—'}</td>
                                      <td className="text-center px-[2vw] md:px-3 py-[1.5vw] md:py-1.5 text-gray-600">{fmtRx(eye?.add)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {rx.prescriptionImage && (
                            <a href={rx.prescriptionImage} target="_blank" rel="noreferrer"
                               className="inline-flex items-center gap-1 text-[2.5vw] md:text-xs text-indigo-600 underline underline-offset-2 hover:text-indigo-800 mt-[2vw] md:mt-2">
                              View prescription image ↗
                            </a>
                          )}
                          {rx.otherDetails && (
                            <p className="text-[2.5vw] md:text-xs text-gray-500 italic mt-[1vw] md:mt-1">{rx.otherDetails}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
              <h2 className="text-h4TextPhone md:text-xl font-bold mb-[4vw] md:mb-4">Shipping Address</h2>
              <div className="space-y-[2vw] md:space-y-2">
                <p className="font-semibold text-regularTextPhone md:text-regularText">{toTitleCase(order.shippingAddress.name || order.shippingAddress.fullName)}</p>
                <p className="text-regularTextPhone md:text-regularText">{order.shippingAddress.address}</p>
                <p className="text-regularTextPhone md:text-regularText">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}</p>
                <p className="text-regularTextPhone md:text-regularText">Phone: {order.shippingAddress.phone}</p>
                <p className="text-regularTextPhone md:text-regularText">Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
              <h2 className="text-h4TextPhone md:text-xl font-bold mb-[4vw] md:mb-4">Payment Details</h2>
              <div className="space-y-[2vw] md:space-y-2">
                <div className="flex justify-between">
                  <span className="text-regularTextPhone md:text-regularText">Method:</span>
                  <span className="font-semibold text-regularTextPhone md:text-regularText">{order.paymentDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-regularTextPhone md:text-regularText">Status:</span>
                  <span className={`px-[2vw] md:px-2 py-[1vw] md:py-1 rounded text-smallTextPhone md:text-sm ${getStatusColor(order.paymentDetails.status)}`}>
                    {order.paymentDetails.status}
                  </span>
                </div>
                {order.paymentDetails.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-regularTextPhone md:text-regularText">Transaction ID:</span>
                    <span className="font-mono text-smallTextPhone md:text-sm">{order.paymentDetails.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tracking and Shiprocket Info */}
          <div className="space-y-[6vw] md:space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
              <h2 className="text-h4TextPhone md:text-xl font-bold mb-[4vw] md:mb-4">Order Summary</h2>
              <div className="space-y-[2vw] md:space-y-2">
                <div className="flex justify-between">
                  <span className="text-regularTextPhone md:text-regularText">Subtotal:</span>
                  <span className="text-regularTextPhone md:text-regularText">₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-regularTextPhone md:text-regularText">Tax:</span>
                  <span className="text-regularTextPhone md:text-regularText">₹{order.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-regularTextPhone md:text-regularText">Delivery Charges:</span>
                  <span className="text-regularTextPhone md:text-regularText">₹{order.deliveryCharges}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-regularTextPhone md:text-regularText">Discount:</span>
                    <span className="text-regularTextPhone md:text-regularText">-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-h5TextPhone md:text-lg border-t pt-[2vw] md:pt-2">
                  <span className="text-regularTextPhone md:text-regularText">Total:</span>
                  <span className="text-regularTextPhone md:text-regularText">₹{order.finalAmount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Tracking */}
            {order.shippingDetails?.waybill && (
              <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[4vw] md:mb-4 gap-[3vw] md:gap-0">
                  <h2 className="text-h4TextPhone md:text-xl font-bold">Delivery Tracking</h2>
                  <button
                    onClick={fetchTrackingInfo}
                    disabled={trackingLoading}
                    className="bg-blue-600 text-white px-[4vw] md:px-4 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-regularTextPhone md:text-regularText"
                  >
                    {trackingLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                {/* Delhivery Details */}
                <div className="space-y-[3vw] md:space-y-3 mb-[4vw] md:mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-regularTextPhone md:text-regularText">Waybill:</span>
                    <span className="font-mono text-smallTextPhone md:text-regularText">{order.shippingDetails.waybill}</span>
                  </div>
                  {order.shippingDetails.carrier && (
                    <div className="flex justify-between">
                      <span className="text-regularTextPhone md:text-regularText">Courier:</span>
                      <span className="text-regularTextPhone md:text-regularText">{order.shippingDetails.carrier}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-regularTextPhone md:text-regularText">Tracking:</span>
                    <a
                      href={`https://www.delhivery.com/track/package/${order.shippingDetails.waybill}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-regularTextPhone md:text-regularText"
                    >
                      Track Package
                    </a>
                  </div>
                </div>

                {/* Tracking Updates */}
                {trackingInfo && trackingInfo.data && (
                  <div>
                    <h3 className="font-semibold mb-[3vw] md:mb-3 text-regularTextPhone md:text-regularText">Tracking Updates</h3>
                    <div className="space-y-[3vw] md:space-y-3">
                      {trackingInfo.data.map((update, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-[4vw] md:pl-4">
                          <p className="font-semibold text-regularTextPhone md:text-regularText">{update.status}</p>
                          <p className="text-smallTextPhone md:text-sm text-gray-600">{update.location}</p>
                          <p className="text-tinyTextPhone md:text-xs text-gray-500">{formatDate(update.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-[4vw] md:rounded-lg shadow p-[6vw] md:p-6">
                <h2 className="text-h4TextPhone md:text-xl font-bold mb-[4vw] md:mb-4">Order Notes</h2>
                <p className="text-regularTextPhone md:text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-[6vw] md:mt-6 flex flex-col md:flex-row justify-center space-y-[3vw] md:space-y-0 space-x-0 md:space-x-4 gap-[3vw] md:gap-0">
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-600 text-white px-[6vw] md:px-6 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg hover:bg-gray-700 text-regularTextPhone md:text-regularText"
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
              className="bg-red-600 text-white px-[6vw] md:px-6 py-[2vw] md:py-2 rounded-[2vw] md:rounded-lg hover:bg-red-700 text-regularTextPhone md:text-regularText"
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