import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '@/url';
import { toTitleCase } from '../../../../shared/pipes/strFormatting';

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
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const UnlockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const ROLE_STYLES = {
  'super-admin':     'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  'admin':           'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  'product-manager': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'user':            'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
};

const ROLE_LABELS = {
  'super-admin':     'Super Admin',
  'admin':           'Admin',
  'product-manager': 'Product Manager',
  'user':            'Customer',
};

const RoleBadge = ({ role }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-600'}`}>
    {ROLE_LABELS[role] ?? role}
  </span>
);

const StatusBadge = ({ blocked }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
    blocked === 'true' ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }`}>
    {blocked === 'true' ? 'Blocked' : 'Active'}
  </span>
);

const PAGE_SIZE = 10;

const ROLE_FILTERS = ['', 'user', 'product-manager', 'super-admin', 'admin'];
const ROLE_FILTER_LABELS = { '': 'All', 'user': 'Customers', 'product-manager': 'Product Manager', 'super-admin': 'Super Admin', 'admin': 'Admin' };

// ── Main Component ────────────────────────────────────────────────────────────
const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [roleFilter, setRoleFilter]     = useState('');
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(1);

  const [drawer, setDrawer]             = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [blocking, setBlocking]         = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/admin/get-users`, { withCredentials: true });
      setUsers(data.users ?? []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentBlocked) => {
    setBlocking(true);
    try {
      const { data } = await axios.post(
        `${baseURL}/api/admin/toggle-block-user/${userId}`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        const newBlocked = currentBlocked === 'true' ? 'false' : 'true';
        toast.success(data.message);
        setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, blocked: newBlocked } : u));
        setDrawer((prev) => prev ? { ...prev, blocked: newBlocked } : prev);
      }
    } catch {
      toast.error('Failed to update user status');
    } finally {
      setBlocking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(
        `${baseURL}/api/admin/delete-user/${confirmDelete}`,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('User deleted');
        setUsers((prev) => prev.filter((u) => u._id !== confirmDelete));
        if (drawer?._id === confirmDelete) setDrawer(null);
        setConfirmDelete(null);
      }
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchSearch = !search || [u.name, u.email, u.number].some(
      (v) => v?.toLowerCase().includes(search.toLowerCase())
    );
    return matchRole && matchSearch;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} {roleFilter ? ROLE_FILTER_LABELS[roleFilter].toLowerCase() : 'total users'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => navigate('/Admin/add-user')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
          >
            <PlusIcon />
            Add User
          </button>
        </div>
      </div>

      {/* ── Filter + Search bar ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Role</span>
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => handleRoleFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                roleFilter === r ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ROLE_FILTER_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={handleSearch}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-56"
          />
        </div>
      </div>

      {/* ── Table card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-4xl">👤</span>
            <p className="text-sm font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['#', 'Name', 'Email', 'Phone', 'Role', 'Orders', 'Status', 'Joined', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-4 text-gray-400 text-xs font-medium">
                      {(safePage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-800">{toTitleCase(user.name)}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {user.number || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {user.orders?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge blocked={user.blocked} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          title="View details"
                          onClick={() => setDrawer(user)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          title="Delete user"
                          onClick={() => setConfirmDelete(user._id)}
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
            <span className="text-xs text-gray-500">Page {safePage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User Detail Drawer ──────────────────────────────────────────── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDrawer(null)} />

          <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">User</p>
                <p className="font-bold text-gray-800 text-lg">{toTitleCase(drawer.name)}</p>
              </div>
              <div className="flex items-center gap-3">
                <RoleBadge role={drawer.role} />
                <button onClick={() => setDrawer(null)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500">
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Account Info */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Account</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                  <Row label="Email"   value={drawer.email} />
                  <Row label="Phone"   value={drawer.number || '—'} />
                  <Row label="Gender"  value={toTitleCase(drawer.gender) || '—'} />
                  <Row label="Joined"  value={formatDate(drawer.createdAt)} />
                  <Row label="Orders"  value={<span className="font-bold text-gray-900">{drawer.orders?.length ?? 0}</span>} />
                  <Row
                    label="Status"
                    value={<StatusBadge blocked={drawer.blocked} />}
                  />
                </div>
              </section>

              {/* Address */}
              {(drawer.address || drawer.city || drawer.state) && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Address</h4>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 text-gray-600">
                    {drawer.address && <p>{drawer.address}</p>}
                    {(drawer.city || drawer.state) && (
                      <p>{[drawer.city, drawer.state].filter(Boolean).join(', ')}{drawer.zipcode ? ` – ${drawer.zipcode}` : ''}</p>
                    )}
                  </div>
                </section>
              )}

              {/* Block / Unblock */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Account Control</h4>
                <button
                  onClick={() => handleToggleBlock(drawer._id, drawer.blocked)}
                  disabled={blocking}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-lg transition-colors border disabled:opacity-50 ${
                    drawer.blocked === 'true'
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100'
                  }`}
                >
                  {blocking ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : drawer.blocked === 'true' ? (
                    <><UnlockIcon /> Unblock User</>
                  ) : (
                    <><LockIcon /> Block User</>
                  )}
                </button>
              </section>
            </div>

            {/* Panel footer — delete */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button
                onClick={() => setConfirmDelete(drawer._id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-lg transition-colors border border-red-100"
              >
                <TrashIcon />
                Delete this user
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
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete User?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove the user and all their data. This action cannot be undone.
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
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-gray-400 shrink-0 text-xs font-medium mt-0.5">{label}</span>
    <span className="text-gray-700 text-right text-xs font-medium">{value}</span>
  </div>
);

export default UserManagement;
