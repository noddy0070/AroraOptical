import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';

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
  const [confirmDelete, setConfirmDelete] = useState(null);   // order id pending deletion
  const [deleting, setDeleting]           = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Tracking
  const [trackingData, setTrackingData]   = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => { fetchOrders(); }, [selectedStatus, currentPage]);

  // Reset tracking whenever a different order is opened
  useEffect(() => { setTrackingData(null); }, [drawer?._id]);

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
                  {['Order', 'Customer', 'Items', 'Amount', 'Order Status', 'Payment', 'Date', ''].map((h) => (
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
                  <Row label="Name" value={drawer.userId?.name || drawer.shippingAddress.fullName} />
                  <Row label="Email" value={drawer.userId?.email} />
                  <Row label="Phone" value={drawer.shippingAddress.mobileNumber} />
                  <div className="pt-1 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-1 mt-2">Shipping address</p>
                    <p className="text-gray-700">{drawer.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{drawer.shippingAddress.flat}, {drawer.shippingAddress.area}</p>
                    <p className="text-gray-600">{drawer.shippingAddress.city}, {drawer.shippingAddress.state} – {drawer.shippingAddress.pincode}</p>
                  </div>
                </div>
              </section>

              {/* Products */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Items</h4>
                <div className="space-y-2">
                  {drawer.products.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      {item.productId?.images?.[0] && (
                        <img src={item.productId.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.productId?.modelName || 'Product'}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Shipping & Tracking */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Shipping & Tracking</h4>
                  {drawer.shiprocket?.shipmentId && (
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

                {drawer.shiprocket?.shipmentId ? (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                    <Row label="Shipment ID" value={drawer.shiprocket.shipmentId} />
                    {drawer.shiprocket.awbCode    && <Row label="AWB"     value={drawer.shiprocket.awbCode} />}
                    {drawer.shiprocket.courierName && <Row label="Courier" value={drawer.shiprocket.courierName} />}
                    {drawer.shiprocket.trackingUrl && (
                      <Row
                        label="Track"
                        value={
                          <a href={drawer.shiprocket.trackingUrl} target="_blank" rel="noreferrer"
                             className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800 text-xs">
                            Open tracker ↗
                          </a>
                        }
                      />
                    )}

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

export default OrderManagement;
