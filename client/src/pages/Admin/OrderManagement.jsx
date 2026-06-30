import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { baseURL } from '@/url';
import { toTitleCase } from '../../../shared/pipes/strFormatting';

// ── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p ?? 0);

const ORDER_STATUS_STYLES = {
  Pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Confirmed:  'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Processing: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  Shipped:    'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  Delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Cancelled:  'bg-red-50 text-red-700 ring-1 ring-red-200',
  Failed:     'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const PAYMENT_STATUS_STYLES = {
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Failed:    'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const StatusBadge = ({ label, styleMap }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styleMap[label] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'}`}>
    {label || '—'}
  </span>
);

const LensIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="12" r="5" />
    <circle cx="15" cy="12" r="5" />
  </svg>
);
const InfoIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 .001M13 16l2 .001M13 16H9m4 0h2m0 0l2-5h2l2 3v2h-6z" />
  </svg>
);
const RefreshIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────
const OrderManagement = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalOrders, setTotalOrders]     = useState(0);

  const [drawer, setDrawer]               = useState(null);   // selected order for side panel
  const [lensModal, setLensModal]         = useState(null);   // order for lens options modal
  const [specModal, setSpecModal]         = useState(null);   // { snap, productId, fetched }
  const [specLoading, setSpecLoading]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);   // order id pending deletion
  const [deleting, setDeleting]           = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Tracking
  const [trackingData, setTrackingData]   = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => { fetchOrders(); }, [selectedStatus, currentPage]);

  // Reset tracking whenever a different order is opened
  useEffect(() => { setTrackingData(null); }, [drawer?._id]);

  const openSpecModal = async (item) => {
    const snap = item.productSnapshot || {};
    const pid  = item.productId?._id || item.productId;
    setSpecModal({ snap, productId: pid, fetched: null });
    if (!pid) return;
    setSpecLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/product/${pid}`, { withCredentials: true });
      setSpecModal(prev => prev ? { ...prev, fetched: data } : prev);
    } catch {
      // show snapshot-only if fetch fails
    } finally {
      setSpecLoading(false);
    }
  };

  const fetchTracking = async (orderId) => {
    setTrackingLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/order/${orderId}/track`, { withCredentials: true });
      setTrackingData(data);
    } catch {
      toast.error('Failed to fetch tracking info');
    } finally {
      setTrackingLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (selectedStatus) params.status = selectedStatus;

      const { data } = await axios.get(`${baseURL}/api/order/admin/all`, { params, withCredentials: true });
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotalOrders(data.total);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const { data } = await axios.put(
        `${baseURL}/api/order/admin/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Order status updated');
        // Patch drawer state so the badge refreshes instantly
        setDrawer((prev) => prev ? { ...prev, status: newStatus } : prev);
        fetchOrders();
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        `${baseURL}/api/order/admin/${confirmDelete}`,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Order deleted');
        setConfirmDelete(null);
        if (drawer?._id === confirmDelete) setDrawer(null);
        fetchOrders();
      }
    } catch {
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalOrders} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Filter by status</span>
        <div className="flex flex-wrap gap-2">
          {['', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => { setSelectedStatus(s); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedStatus === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['Order', 'Customer', 'Items', 'Amount', 'Order Status', 'Payment', 'Date', 'Lens', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Order ID */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    {/* Customer */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-800">{order.userId?.name || '—'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.userId?.email}</p>
                    </td>
                    {/* Items */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">{order.products.length} item{order.products.length !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[10rem] truncate">
                        {order.products.slice(0, 2).map(i => i.productId?.modelName).filter(Boolean).join(', ')}
                        {order.products.length > 2 && ' …'}
                      </p>
                    </td>
                    {/* Amount */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {formatPrice(order.finalAmount)}
                    </td>
                    {/* Order Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge label={order.status} styleMap={ORDER_STATUS_STYLES} />
                    </td>
                    {/* Payment */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge label={order.paymentDetails?.status || 'Pending'} styleMap={PAYMENT_STATUS_STYLES} />
                      <p className="text-xs text-gray-400 mt-1">{order.paymentDetails?.method || 'COD'}</p>
                    </td>
                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    {/* Lens */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {order.products.some(p => p.lensOptions?.lensType || p.lensOptions?.lensCoating) ? (
                        <button
                          onClick={() => setLensModal(order)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200 rounded-full transition-colors"
                        >
                          <LensIcon /> View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="View / Edit"
                          onClick={() => setDrawer(order)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          title="Delete order"
                          onClick={() => setConfirmDelete(order._id)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Order Detail Drawer ─────────────────────────────────────────── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDrawer(null)} />

          {/* Panel */}
          <div className="w-[480px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Order</p>
                <p className="font-mono font-bold text-gray-800 text-lg">#{drawer._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge label={drawer.status} styleMap={ORDER_STATUS_STYLES} />
                <button onClick={() => setDrawer(null)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Panel body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Payment Info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Payment</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                  <Row label="Amount" value={<span className="font-bold text-gray-900">{formatPrice(drawer.finalAmount)}</span>} />
                  <Row label="Method" value={drawer.paymentDetails?.method || 'COD'} />
                  <Row
                    label="Status"
                    value={<StatusBadge label={drawer.paymentDetails?.status || 'Pending'} styleMap={PAYMENT_STATUS_STYLES} />}
                  />
                  {drawer.paymentDetails?.transactionId && (
                    <Row label="Txn ID" value={<span className="font-mono text-xs break-all">{drawer.paymentDetails.transactionId}</span>} />
                  )}
                  <Row label="Date" value={formatDate(drawer.createdAt)} />
                </div>
              </section>

              {/* Customer & Address */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Customer</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                  <Row label="Name" value={toTitleCase(drawer.userId?.name || drawer.shippingAddress.fullName)} />
                  <Row label="Email" value={drawer.userId?.email} />
                  <Row label="Phone" value={drawer.shippingAddress.mobileNumber} />
                  <div className="pt-1 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-1 mt-2">Shipping address</p>
                    <p className="text-gray-700">{toTitleCase(drawer.shippingAddress.fullName)}</p>
                    <p className="text-gray-600">{drawer.shippingAddress.flat}, {drawer.shippingAddress.area}</p>
                    <p className="text-gray-600">{drawer.shippingAddress.city}, {drawer.shippingAddress.state} – {drawer.shippingAddress.pincode}</p>
                  </div>
                </div>
              </section>

              {/* Products */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Items</h4>
                <div className="space-y-3">
                  {drawer.products.map((item, i) => {
                    const snap = item.productSnapshot || {};
                    const lens = item.lensOptions || {};
                    const hasLens = lens.lensType && lens.lensType !== 'None';
                    const rx = item.prescriptionId;
                    const modelName = snap.modelName || item.productId?.modelName || 'Product';
                    const modelCode = snap.modelCode || item.productId?.modelCode;
                    const image     = snap.images?.[0] || item.productId?.images?.[0];
                    return (
                      <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Product row */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50">
                          {image && (
                            <Link to={`/product/${item.productId?._id}`} target="_blank" rel="noreferrer" className="shrink-0">
                              <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover hover:opacity-80 transition-opacity" />
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.productId?._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-gray-800 text-sm truncate hover:text-indigo-600 hover:underline underline-offset-2 transition-colors"
                            >
                              {modelName}
                            </Link>
                            {modelCode && <p className="text-xs text-gray-400">{modelCode}</p>}
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            {item.size && (
                              <p className="text-xs text-gray-400">Size: <span className="font-medium text-gray-600">{item.size}</span></p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <p className="text-sm font-semibold text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                            <button
                              onClick={() => openSpecModal(item)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full transition-colors"
                              title="View product specifications"
                            >
                              <InfoIcon /> Specs
                            </button>
                          </div>
                        </div>

                        {/* Lens options */}
                        {hasLens && (
                          <div className="border-t border-gray-100 px-3 py-2.5">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Lens Selection</p>
                            <div className="flex flex-wrap gap-1.5">
                              {lens.lensType && lens.lensType !== 'None' && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">{lens.lensType}</span>
                              )}
                              {lens.lensCoating && lens.lensCoating !== 'None' && (
                                <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">{lens.lensCoating}</span>
                              )}
                              {lens.lensThickness && lens.lensThickness !== 'None' && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">{lens.lensThickness} thickness</span>
                              )}
                              {lens.lensTint && lens.lensTint !== 'None' && (
                                <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">{lens.lensTint} tint</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Prescription */}
                        {rx && (
                          <div className="border-t border-gray-100 px-3 py-2.5">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Prescription</p>
                            <div className="flex flex-wrap gap-3 text-[10px] text-gray-500 mb-2">
                              <span>Name: <span className="font-semibold text-gray-700">{rx.prescriptionName}</span></span>
                              <span>Date: <span className="font-semibold text-gray-700">{rx.prescriptionDate}</span></span>
                              {rx.source && <span>Type: <span className="font-semibold text-gray-700">{rx.source}</span></span>}
                              {rx.pupillaryDistance?.main && <span>PD: <span className="font-semibold text-gray-700">{rx.pupillaryDistance.main}</span></span>}
                            </div>
                            {(rx.rightEye?.sphere != null || rx.leftEye?.sphere != null) && (
                              <table className="w-full text-[10px] border-collapse mb-1.5">
                                <thead>
                                  <tr className="bg-gray-100 text-gray-400">
                                    <th className="text-left px-2 py-1 font-semibold"></th>
                                    <th className="text-center px-2 py-1 font-semibold">SPH</th>
                                    <th className="text-center px-2 py-1 font-semibold">CYL</th>
                                    <th className="text-center px-2 py-1 font-semibold">AXIS</th>
                                    <th className="text-center px-2 py-1 font-semibold">ADD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[['Right (OD)', rx.rightEye], ['Left (OS)', rx.leftEye]].map(([label, eye]) => (
                                    <tr key={label} className="border-t border-gray-100">
                                      <td className="px-2 py-1 font-semibold text-gray-700">{label}</td>
                                      <td className="text-center px-2 py-1 text-gray-600">{fmtRx(eye?.sphere)}</td>
                                      <td className="text-center px-2 py-1 text-gray-600">{fmtRx(eye?.cylinder)}</td>
                                      <td className="text-center px-2 py-1 text-gray-600">{eye?.axis ?? '—'}</td>
                                      <td className="text-center px-2 py-1 text-gray-600">{fmtRx(eye?.add)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                            {rx.prescriptionImage && (
                              <a href={rx.prescriptionImage} target="_blank" rel="noreferrer"
                                 className="inline-flex items-center gap-1 text-[10px] text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
                                View prescription image ↗
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Shipping & Tracking */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Shipping & Tracking</h4>
                  {drawer.shippingDetails?.waybill && (
                    <button
                      onClick={() => fetchTracking(drawer._id)}
                      disabled={trackingLoading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RefreshIcon />
                      {trackingLoading ? 'Loading…' : 'Refresh'}
                    </button>
                  )}
                </div>

                {drawer.shippingDetails?.waybill ? (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                    <Row label="Waybill" value={drawer.shippingDetails.waybill} />
                    {drawer.shippingDetails.carrier  && <Row label="Carrier" value={drawer.shippingDetails.carrier} />}
                    {drawer.shippingDetails.status   && <Row label="Status"  value={drawer.shippingDetails.status} />}
                    {drawer.shippingDetails.manifestPending && (
                      <Row label="Action" value={<span className="text-red-500 font-semibold text-xs">Manifest failed — re-run needed</span>} />
                    )}
                    <Row
                      label="Track"
                      value={
                        <a href={`https://www.delhivery.com/track/package/${drawer.shippingDetails.waybill}`} target="_blank" rel="noreferrer"
                           className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800 text-xs">
                          Open tracker ↗
                        </a>
                      }
                    />

                    {trackingLoading && (
                      <div className="flex items-center gap-2 pt-2 text-gray-400 text-xs">
                        <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        Fetching updates…
                      </div>
                    )}

                    {trackingData && (() => {
                      const activities = trackingData.trackingInfo?.data?.[0]?.activities ?? [];
                      return activities.length > 0 ? (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Timeline</p>
                          <ol className="relative border-l border-gray-200 space-y-3 ml-2">
                            {activities.slice(0, 8).map((a, i) => (
                              <li key={i} className="ml-4">
                                <span className={`absolute -left-[5px] flex h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                <p className="text-xs font-semibold text-gray-700 leading-tight">{a.activity || a.status}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{a.location} · {a.date}</p>
                              </li>
                            ))}
                          </ol>
                          {activities.length > 8 && (
                            <p className="text-[10px] text-gray-400 mt-2 ml-4">+{activities.length - 8} more events</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 pt-2">No tracking events yet.</p>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-400 flex items-center gap-2">
                    <TruckIcon />
                    No shipment created yet.
                  </div>
                )}
              </section>

              {/* Update Status */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Update Order Status</h4>
                <div className="flex gap-2">
                  <select
                    defaultValue={drawer.status}
                    onChange={(e) => handleStatusUpdate(drawer._id, e.target.value)}
                    disabled={statusUpdating}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 bg-white"
                  >
                    {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {statusUpdating && (
                    <div className="flex items-center px-3">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Panel footer — delete */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button
                onClick={() => setConfirmDelete(drawer._id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-lg transition-colors border border-red-100"
              >
                <TrashIcon />
                Delete this order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Spec Modal ─────────────────────────────────────────── */}
      {specModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSpecModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Product Snapshot</p>
                <p className="font-bold text-gray-800 text-base leading-tight">{specModal.snap.modelTitle || specModal.snap.modelName || 'Product'}</p>
              </div>
              <button onClick={() => setSpecModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <XIcon />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {/* Snapshot basics */}
              <section>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Snapshot</p>
                <div className="flex gap-4">
                  {specModal.snap.images?.[0] && (
                    <img src={specModal.snap.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-100" />
                  )}
                  <div className="bg-gray-50 rounded-xl p-3 flex-1 space-y-1.5 text-xs">
                    {specModal.snap.modelName  && <Row label="Model"    value={specModal.snap.modelName} />}
                    {specModal.snap.modelCode  && <Row label="Code"     value={specModal.snap.modelCode} />}
                    {specModal.snap.brand      && <Row label="Brand"    value={specModal.snap.brand} />}
                    {specModal.snap.category   && <Row label="Category" value={<span className="capitalize">{specModal.snap.category}</span>} />}
                    {specModal.snap.price != null && <Row label="Price at order" value={<span className="font-bold text-gray-900">{formatPrice(specModal.snap.price)}</span>} />}
                  </div>
                </div>
              </section>

              {/* Full product specs from live data */}
              {specLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  Loading full specifications…
                </div>
              )}

              {specModal.fetched && (() => {
                const p = specModal.fetched;
                const hasFrame   = p.frameAttributes?.length   > 0;
                const hasLens    = p.lensAttributes?.length    > 0;
                const hasGeneral = p.generalAttributes?.length > 0;
                return (
                  <div className="space-y-4">
                    {/* Core details */}
                    <section>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                        {p.gender      && <Row label="Gender"   value={p.gender} />}
                        {p.rx != null  && <Row label="Rx"       value={p.rx ? 'Yes (prescription required)' : 'No'} />}
                        {p.size?.length > 0 && <Row label="Sizes" value={p.size.join(', ')} />}
                        {p.description && (
                          <div className="pt-1.5 border-t border-gray-200 mt-1.5">
                            <p className="text-gray-400 text-[10px] mb-0.5">Description</p>
                            <p className="text-gray-700 leading-relaxed">{p.description}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Frame attributes */}
                    {hasFrame && (
                      <section>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Frame Specifications</p>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                          {p.frameAttributes.map((a, i) => (
                            <Row key={i} label={a.name} value={a.value} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Lens attributes */}
                    {hasLens && (
                      <section>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Lens Specifications</p>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                          {p.lensAttributes.map((a, i) => (
                            <Row key={i} label={a.name} value={a.value} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* General attributes */}
                    {hasGeneral && (
                      <section>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">General Specifications</p>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                          {p.generalAttributes.map((a, i) => (
                            <Row key={i} label={a.name} value={a.value} />
                          ))}
                        </div>
                      </section>
                    )}

                    {!hasFrame && !hasLens && !hasGeneral && (
                      <p className="text-xs text-gray-400 italic">No additional specifications on record.</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Lens Options Modal ─────────────────────────────────────────── */}
      {lensModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setLensModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Lens Options</p>
                <p className="font-mono font-bold text-gray-800 text-lg">#{lensModal._id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setLensModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <XIcon />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-8">
              {lensModal.products
                .filter(p => p.lensOptions?.lensType || p.lensOptions?.lensCoating)
                .map((product, i) => (
                  <div key={i} className="space-y-4">
                    {/* Product header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      {product.productId?.images?.[0] && (
                        <img src={product.productId.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{product.productId?.modelName || 'Product'}</p>
                        <p className="text-xs text-gray-400">Qty: {product.quantity}</p>
                      </div>
                    </div>

                    {/* Lens selections */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lens Selections</p>
                      <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                        {product.lensOptions.lensType && <LensRow label="Lens Type" value={product.lensOptions.lensType} />}
                        {product.lensOptions.lensCoating && <LensRow label="Coating" value={product.lensOptions.lensCoating} />}
                        {product.lensOptions.lensThickness && <LensRow label="Thickness" value={`Index ${product.lensOptions.lensThickness === 'Medium' ? '1.56' : '1.59'} (${product.lensOptions.lensThickness})`} />}
                        {product.lensOptions.lensTint && <LensRow label="Tint" value={product.lensOptions.lensTint} />}
                      </div>
                    </div>

                    {/* Prescription */}
                    {product.prescriptionId ? (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prescription</p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                          <div className="flex flex-wrap gap-4 text-xs">
                            <span><span className="text-gray-400">Name: </span><span className="font-semibold text-gray-700">{product.prescriptionId.prescriptionName}</span></span>
                            <span><span className="text-gray-400">Date: </span><span className="font-semibold text-gray-700">{product.prescriptionId.prescriptionDate}</span></span>
                            <span><span className="text-gray-400">Type: </span><span className="font-semibold text-gray-700">{product.prescriptionId.prescriptionType}</span></span>
                            {product.prescriptionId.pupillaryDistance?.main && (
                              <span><span className="text-gray-400">PD: </span><span className="font-semibold text-gray-700">{product.prescriptionId.pupillaryDistance.main}</span></span>
                            )}
                          </div>
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="py-1.5 pr-4 text-left text-gray-400 font-semibold w-20">Eye</th>
                                <th className="py-1.5 px-3 text-center text-gray-400 font-semibold">Sphere</th>
                                <th className="py-1.5 px-3 text-center text-gray-400 font-semibold">Cylinder</th>
                                <th className="py-1.5 px-3 text-center text-gray-400 font-semibold">Axis</th>
                                <th className="py-1.5 px-3 text-center text-gray-400 font-semibold">Add</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[['Right (OD)', product.prescriptionId.rightEye], ['Left (OS)', product.prescriptionId.leftEye]].map(([label, eye]) => (
                                <tr key={label} className="border-b border-gray-100 last:border-0">
                                  <td className="py-2 pr-4 font-semibold text-gray-700">{label}</td>
                                  <td className="py-2 px-3 text-center text-gray-600">{fmtRx(eye?.sphere)}</td>
                                  <td className="py-2 px-3 text-center text-gray-600">{fmtRx(eye?.cylinder)}</td>
                                  <td className="py-2 px-3 text-center text-gray-600">{eye?.axis ?? '—'}</td>
                                  <td className="py-2 px-3 text-center text-gray-600">{fmtRx(eye?.add)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {product.prescriptionId.prescriptionImage && (
                            <a href={product.prescriptionId.prescriptionImage} target="_blank" rel="noreferrer"
                               className="inline-flex items-center gap-1 text-xs text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
                              View uploaded prescription image ↗
                            </a>
                          )}
                          {product.prescriptionId.otherDetails && (
                            <p className="text-xs text-gray-500 italic">{product.prescriptionId.otherDetails}</p>
                          )}
                        </div>
                      </div>
                    ) : product.lensOptions.lensType !== 'Zero Power' && (
                      <p className="text-xs text-gray-400 italic">No prescription linked to this item.</p>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ──────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <TrashIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Order?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove order <span className="font-mono font-semibold">#{confirmDelete.slice(-8).toUpperCase()}</span> and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small helper for two-column rows inside info cards
const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-gray-400 shrink-0 text-xs font-medium mt-0.5">{label}</span>
    <span className="text-gray-700 text-right text-xs font-medium">{value}</span>
  </div>
);

// Lens option row inside the lens modal grid
const LensRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-xs text-gray-700 font-medium mt-0.5">{value || '—'}</p>
  </div>
);

// Format a prescription numeric value (show sign explicitly)
const fmtRx = (v) => {
  if (v == null) return '—';
  return v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2);
};

export default OrderManagement;
