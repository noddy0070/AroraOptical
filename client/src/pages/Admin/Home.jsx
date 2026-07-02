import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';
import { toast } from 'react-toastify';
import { toTitleCase } from '../../../shared/pipes/strFormatting';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p ?? 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Status pill ───────────────────────────────────────────────────────────────
const ORDER_STATUS_STYLES = {
  Pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Confirmed:  'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Processing: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  Shipped:    'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  Delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Cancelled:  'bg-red-50 text-red-700 ring-1 ring-red-200',
  Failed:     'bg-red-50 text-red-700 ring-1 ring-red-200',
};
const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status}
  </span>
);

// ── Order status bar ──────────────────────────────────────────────────────────
const StatusBar = ({ label, count, total, color }) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{count}</span>
    </div>
  );
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const BoxIcon    = () => <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>;
const UsersIcon  = () => <svg className="w-5 h-5 text-blue-600"   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const BagIcon    = () => <svg className="w-5 h-5 text-amber-600"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
const CashIcon   = () => <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>;
const ArrowRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>;

// ── Main component ─────────────────────────────────────────────────────────────
const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats]               = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/admin/stats', {});
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders ?? []);
        }
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalOrders = stats?.totalOrders ?? 0;

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 space-y-6">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your store</p>
        </div>
        <button
          onClick={() => navigate('/Admin/order-management')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
          Manage Orders <ArrowRight />
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          sub={`${stats?.pendingOrders ?? 0} pending`}
          color="bg-indigo-50"
          icon={<BoxIcon />}
        />
        <StatCard
          label="Revenue"
          value={formatPrice(stats?.totalRevenue)}
          sub="Completed payments only"
          color="bg-emerald-50"
          icon={<CashIcon />}
        />
        <StatCard
          label="Customers"
          value={stats?.totalUsers ?? 0}
          sub="Registered accounts"
          color="bg-blue-50"
          icon={<UsersIcon />}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? 0}
          sub="In catalogue"
          color="bg-amber-50"
          icon={<BagIcon />}
        />
      </div>

      {/* ── Middle row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Order status breakdown */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Order Status</h2>
          <div className="space-y-3">
            <StatusBar label="Pending"   count={stats?.pendingOrders   ?? 0} total={totalOrders} color="bg-amber-400" />
            <StatusBar label="Confirmed" count={stats?.confirmedOrders ?? 0} total={totalOrders} color="bg-blue-400" />
            <StatusBar label="Shipped"   count={stats?.shippedOrders   ?? 0} total={totalOrders} color="bg-indigo-400" />
            <StatusBar label="Delivered" count={stats?.deliveredOrders ?? 0} total={totalOrders} color="bg-emerald-400" />
          </div>
          <button
            onClick={() => navigate('/Admin/order-management')}
            className="mt-5 w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all orders →
          </button>
        </div>

        {/* Quick actions */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product',     sub: 'Create a new product listing',       path: '/Admin/add-product',       color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100' },
              { label: 'Bulk Upload',     sub: 'Import products via Excel',           path: '/Admin/products/bulk-upload', color: 'bg-purple-50 hover:bg-purple-100 border-purple-100' },
              { label: 'Manage Orders',   sub: 'View, update, track orders',          path: '/Admin/order-management',  color: 'bg-amber-50  hover:bg-amber-100  border-amber-100' },
              { label: 'User List',       sub: 'View and manage customers',           path: '/Admin/user',              color: 'bg-blue-50   hover:bg-blue-100   border-blue-100' },
              { label: 'Attributes',      sub: 'Manage product attribute sets',       path: '/Admin/attributes',        color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
              { label: 'Product List',    sub: 'Browse and edit catalogue',           path: '/Admin/products',          color: 'bg-gray-50   hover:bg-gray-100   border-gray-200' },
            ].map(({ label, sub, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${color}`}
              >
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent orders ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700">Recent Orders</h2>
          <button
            onClick={() => navigate('/Admin/order-management')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
            <span className="text-3xl">📦</span>
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {['Order', 'Customer', 'Amount', 'Status', 'Payment', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                  onClick={() => navigate('/Admin/order-management')}
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-gray-800">{toTitleCase(order.userId?.name || order.shippingAddress?.fullName || '—')}</p>
                    <p className="text-xs text-gray-400">{order.userId?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-gray-800">
                    {formatPrice(order.finalAmount)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
                    {order.paymentDetails?.method || 'COD'}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
