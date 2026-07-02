/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AttributesIcon, CancellationPolicyIcon, DashboardIcon,
  EcommerceIcon, FAQIcon, HelpCenterIcon, OrderIcon,
  PrivacyPolicyIcon, SettingsIcon, ShippingAndDeliveryIcon,
  TermsAndConditionIcon, UserIcon,
} from './Icons';
import logo from '../../assets/images/AroraOpticalLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import './Dashboard.css';
import { TransitionLink } from '@/Routes/TransitionLink';
import { toTitleCase } from '../../../shared/pipes/strFormatting';
import { api } from '@/lib/axios';
import { logout } from '@/redux/slice/authSlice';

// ── Sidebar data ──────────────────────────────────────────────────────────────
const ecommerceSection  = [{ id: 'Product List' }, { id: 'Add Product' }, { id: 'Bulk Upload' }];
const attributesSection = [{ id: 'Attributes' }];
const userSection       = [{ id: 'User List' }, { id: 'Add User' }];
const orderSection      = [{ id: 'Order Management' }];

const homeSectionFull = [
  { id: 'Dashboard', path: ['/Admin'],                  icon: DashboardIcon,  subSections: [] },
  { id: 'Ecommerce', path: ['/Admin/products', '/Admin/add-product', '/Admin/products/bulk-upload'], icon: EcommerceIcon, subSections: ecommerceSection },
  { id: 'Attributes', path: ['/Admin/attributes'],      icon: AttributesIcon, subSections: attributesSection },
  { id: 'User',       path: ['/Admin/user', '/Admin/add-user'], icon: UserIcon, subSections: userSection },
  { id: 'Order',      path: ['/Admin/order-management'], icon: OrderIcon,     subSections: orderSection },
];

const homeSectionPM = [
  { id: 'Ecommerce',  path: ['/Admin/products', '/Admin/add-product', '/Admin/products/bulk-upload'], icon: EcommerceIcon, subSections: ecommerceSection },
  { id: 'Attributes', path: ['/Admin/attributes'],      icon: AttributesIcon, subSections: attributesSection },
];

const settingsSection = [{ id: 'Eye Test', path: ['/Admin/eye-test-management'], icon: SettingsIcon, subSections: [] }];

const supportSection = [
  { id: 'Help Center',          path: ['/'],                        icon: HelpCenterIcon,         subSections: [] },
  { id: 'FAQs',                 path: ['/Admin/faqs'],              icon: FAQIcon,                subSections: [] },
  { id: 'Privacy Policy',       path: ['/Admin/privacy-policy'],    icon: PrivacyPolicyIcon,      subSections: [] },
  { id: 'Shipping and Delivery',path: ['/Admin/shipping-policy'],   icon: ShippingAndDeliveryIcon,subSections: [] },
  { id: 'Cancellation Policy',  path: ['/Admin/cancellation-policy'], icon: CancellationPolicyIcon, subSections: [] },
  { id: 'Terms and Conditions', path: ['/Admin/terms-and-conditions'], icon: TermsAndConditionIcon, subSections: [] },
];

const buildSections = (role) => {
  const isProductManager = role === 'product-manager';
  const home = { id: 'Home', subSections: isProductManager ? homeSectionPM : homeSectionFull };
  if (isProductManager) return [home];
  return [home, { id: 'Extras', subSections: settingsSection }, { id: 'Support', subSections: supportSection }];
};

const ROLE_LABELS = { 'super-admin': 'Super Admin', 'admin': 'Admin', 'product-manager': 'Product Manager' };

// ── Quick-nav items shown in search dropdown (static) ─────────────────────────
const QUICK_PAGES = [
  { label: 'Dashboard',        path: '/Admin',                      hint: 'Admin home' },
  { label: 'Product List',     path: '/Admin/products',             hint: 'All products' },
  { label: 'Add Product',      path: '/Admin/add-product',          hint: 'Create new product' },
  { label: 'Bulk Upload',      path: '/Admin/products/bulk-upload', hint: 'Import via Excel' },
  { label: 'Attributes',       path: '/Admin/attributes',           hint: 'Manage attributes' },
  { label: 'User List',        path: '/Admin/user',                 hint: 'View customers' },
  { label: 'Add User',         path: '/Admin/add-user',             hint: 'Create user' },
  { label: 'Order Management', path: '/Admin/order-management',     hint: 'View & manage orders' },
  { label: 'Eye Test',         path: '/Admin/eye-test-management',  hint: 'Bookings' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p ?? 0);

const ORDER_STATUS_DOT = {
  Pending:   'bg-amber-400',
  Confirmed: 'bg-blue-400',
  Shipped:   'bg-indigo-400',
  Delivered: 'bg-emerald-400',
  Failed:    'bg-red-400',
  Cancelled: 'bg-red-400',
};

// ── Notification bell ─────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const XSmall = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ── Time ago helper ───────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ── NotificationPanel ─────────────────────────────────────────────────────────
const NotificationPanel = ({ notifications, loading, onClose, onDelete, onDeleteAll, navigate }) => (
  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <p className="text-sm font-bold text-gray-800">Notifications</p>
      <div className="flex items-center gap-2">
        {notifications.length > 0 && (
          <button
            onClick={onDeleteAll}
            className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition-colors"
          >
            Clear all
          </button>
        )}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XSmall /></button>
      </div>
    </div>

    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">No notifications yet</div>
      ) : notifications.map((n) => (
        <div
          key={n._id}
          className={`flex items-start gap-3 px-4 py-3 transition-colors group ${!n.read ? 'bg-indigo-50/40' : ''}`}
        >
          <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-gray-300'}`} />
          <button
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
            onClick={() => { navigate('/Admin/order-management'); onClose(); }}
          >
            <p className="text-xs font-semibold text-gray-800 truncate">
              New order — {n.customerName}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5 truncate">
              {n.paymentMethod} · {formatPrice(n.amount)}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
          </button>
          <button
            onClick={() => onDelete(n._id)}
            className="shrink-0 mt-0.5 p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <XSmall />
          </button>
        </div>
      ))}
    </div>

    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
      <button
        onClick={() => { navigate('/Admin/order-management'); onClose(); }}
        className="w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-center"
      >
        View all orders →
      </button>
    </div>
  </div>
);

// ── SearchDropdown ─────────────────────────────────────────────────────────────
const SearchDropdown = ({ query, products, navigate, onSelect }) => {
  const q = query.toLowerCase().trim();

  const pageResults = QUICK_PAGES.filter(
    (p) => p.label.toLowerCase().includes(q) || p.hint.toLowerCase().includes(q)
  ).slice(0, 4);

  const productResults = products.filter(
    (p) => p.modelName?.toLowerCase().includes(q) || p.brandName?.toLowerCase().includes(q)
  ).slice(0, 4);

  if (!q) {
    // Show all pages as quick nav when query is empty
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Quick navigation</p>
        {QUICK_PAGES.slice(0, 6).map((page) => (
          <button
            key={page.path}
            onClick={() => { navigate(page.path); onSelect(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
          >
            <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-xs shrink-0">→</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{page.label}</p>
              <p className="text-[10px] text-gray-400">{page.hint}</p>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (pageResults.length === 0 && productResults.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 px-4 py-6 text-center text-sm text-gray-400">
        No results for &ldquo;{query}&rdquo;
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      {pageResults.length > 0 && (
        <>
          <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Pages</p>
          {pageResults.map((page) => (
            <button
              key={page.path}
              onClick={() => { navigate(page.path); onSelect(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
            >
              <span className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs shrink-0">→</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{page.label}</p>
                <p className="text-[10px] text-gray-400">{page.hint}</p>
              </div>
            </button>
          ))}
        </>
      )}
      {productResults.length > 0 && (
        <>
          <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-t border-gray-50">Products</p>
          {productResults.map((p) => (
            <button
              key={p._id}
              onClick={() => { navigate(`/Admin/edit-product/${p._id}`); onSelect(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
            >
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              ) : (
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs shrink-0">📷</span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.modelName}</p>
                <p className="text-[10px] text-gray-400">{p.brandName}</p>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
};

// ── Main DashBoard component ───────────────────────────────────────────────────
const DashBoard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const user      = useSelector((state) => state.auth.user);

  const mainSections = buildSections(user?.role);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {}, {});
    } catch { /* proceed to clear client state regardless */ }
    dispatch(logout());
    navigate('/');
  };

  // ── Active sidebar state ──────────────────────────────────────────────────
  const getActiveSections = useCallback(() => {
    const sections = buildSections(user?.role);
    for (const main of sections) {
      for (const sub of main.subSections) {
        if (sub.path.includes(location.pathname)) {
          const subIndex = sub.path.indexOf(location.pathname);
          const subSub   = sub.subSections.length ? sub.subSections[subIndex]?.id : 'Null';
          return { section1: main.id, section2: sub.id, section3: subSub };
        }
      }
    }
    return { section1: '', section2: '', section3: 'Null' };
  }, [location.pathname, user?.role]);

  const [active, setActive] = useState(getActiveSections);
  useEffect(() => { setActive(getActiveSections()); }, [location.pathname, getActiveSections]);

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchOpen, setSearchOpen]     = useState(false);
  const [products, setProducts]         = useState([]);
  const searchRef                       = useRef(null);

  // Fetch products once for local filtering
  useEffect(() => {
    api.get('/api/admin/get-products', {})
      .then(({ data }) => setProducts(data.products ?? []))
      .catch(() => {});
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── Notification state ────────────────────────────────────────────────────
  const [notifOpen, setNotifOpen]           = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [notifLoading, setNotifLoading]     = useState(false);
  const notifRef                            = useRef(null);

  // Poll unread count every 30 s
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await api.get('/api/admin/notifications', {});
      if (data.success) setUnreadCount(data.unreadCount ?? 0);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(id);
  }, [fetchUnreadCount]);

  // Fetch full list + mark read when bell is opened
  const openNotifications = async () => {
    setNotifLoading(true);
    try {
      const { data } = await api.get('/api/admin/notifications', {});
      if (data.success) setNotifications(data.notifications ?? []);
      await api.put('/api/admin/notifications/mark-read', {}, {});
      setUnreadCount(0);
    } catch { /* silent */ }
    finally { setNotifLoading(false); }
  };

  const toggleNotif = () => {
    const opening = !notifOpen;
    setNotifOpen(opening);
    setSearchOpen(false);
    if (opening) openNotifications();
  };

  const handleDeleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      await api.delete(`/api/admin/notifications/${id}`, {});
    } catch { /* optimistic — revert not needed for delete */ }
  };

  const handleDeleteAllNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      await api.delete('/api/admin/notifications', {});
    } catch { /* silent */ }
  };

  // Close notification on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── Top navigation bar ─────────────────────────────────────────── */}
      <header className="flex w-full h-16 items-center bg-white border-b border-gray-200 shadow-sm z-40 sticky top-0">

        {/* Logo */}
        <div className="w-[19vw] flex items-center pl-6 gap-2 shrink-0">
          <TransitionLink to="/">
            <img src={logo} alt="logo" className="h-8 w-auto" />
          </TransitionLink>
          <TransitionLink to="/">
            <div className="leading-tight font-dyeLine">
              <p className="text-lg font-medium">Arora</p>
              <p className="text-sm">Opticals</p>
            </div>
          </TransitionLink>
        </div>

        {/* Search */}
        <div className="flex-1 flex items-center px-6">
          <div ref={searchRef} className="relative w-full max-w-xl">
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border bg-gray-50 transition-all duration-150 ${
                searchOpen ? 'border-gray-900 ring-2 ring-gray-900/10 bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <SearchIcon />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search pages, products…"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XSmall />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {searchOpen && (
              <SearchDropdown
                query={searchQuery}
                products={products}
                navigate={navigate}
                onSelect={() => setSearchOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 pr-6 shrink-0">

          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={toggleNotif}
              className={`relative p-2 rounded-lg transition-colors ${
                notifOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationPanel
                notifications={notifications}
                loading={notifLoading}
                onClose={() => setNotifOpen(false)}
                onDelete={handleDeleteNotification}
                onDeleteAll={handleDeleteAllNotifications}
                navigate={navigate}
              />
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* User info */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex flex-col leading-tight">
              <p className="text-sm font-semibold text-gray-800">{toTitleCase(user?.name)}</p>
              <p className="text-[11px] text-gray-400">{ROLE_LABELS[user?.role] ?? 'Admin'}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-[19vw] shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex flex-col px-4 py-5 gap-6 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          {mainSections.map(({ id, subSections }) => (
            <div key={id} className="flex flex-col gap-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1">{id}</p>
              {subSections.map((sub) => (
                <div key={sub.id}>
                  {/* Parent item */}
                  <button
                    onClick={() => navigate(sub.path[0])}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active.section2 === sub.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      {sub.icon()}
                    </span>
                    <span className="flex-1 text-left">{sub.id}</span>
                    {sub.subSections.length > 0 && (
                      <svg
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${active.section2 === sub.id ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24" fill="none"
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  {/* Sub-items — always visible when parent is active */}
                  {sub.subSections.length > 0 && active.section2 === sub.id && (
                    <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-3">
                      {sub.subSections.map((subSub, subIdx) => (
                        <button
                          key={subSub.id}
                          onClick={() => navigate(sub.path[subIdx])}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            active.section3 === subSub.id
                              ? 'text-gray-900 bg-gray-100'
                              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          {subSub.id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoard;
