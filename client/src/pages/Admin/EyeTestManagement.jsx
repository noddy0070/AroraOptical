import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '@/url';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

// ── Icons ─────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const ChevronPrev = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronNext = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Scheduled: 'bg-blue-50   text-blue-700   ring-1 ring-blue-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Cancelled: 'bg-red-50    text-red-700    ring-1 ring-red-200',
  'No Show': 'bg-gray-100  text-gray-600   ring-1 ring-gray-200',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status}
  </span>
);

// ── Detail row inside drawer ───────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const EyeTestManagement = () => {
  const [eyeTests, setEyeTests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterMode, setFilterMode]   = useState('week');
  const [anchorDate, setAnchorDate]   = useState(new Date());
  const [customRange, setCustomRange] = useState([null, null]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [updatingId, setUpdatingId]   = useState(null);

  useEffect(() => { fetchEyeTests(); }, [filterMode, anchorDate, customRange, filterStatus]);

  const getDateRange = () => {
    if (filterMode === 'month') return { start: startOfMonth(anchorDate), end: endOfMonth(anchorDate) };
    if (filterMode === 'custom') { const [start, end] = customRange; return { start, end }; }
    return { start: startOfWeek(anchorDate, { weekStartsOn: 1 }), end: endOfWeek(anchorDate, { weekStartsOn: 1 }) };
  };

  const getRangeLabel = () => {
    const { start, end } = getDateRange();
    if (!(start instanceof Date) || isNaN(start)) return '';
    if (!(end instanceof Date) || isNaN(end)) return '';
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    return sameMonth
      ? `${format(start, 'MMM dd')}–${format(end, 'MMM dd, yyyy')}`
      : `${format(start, 'MMM dd, yyyy')}–${format(end, 'MMM dd, yyyy')}`;
  };

  const shiftAnchor = (dir) => {
    const d = new Date(anchorDate);
    if (filterMode === 'month') { d.setMonth(d.getMonth() + dir); }
    else { d.setDate(d.getDate() + dir * 7); }
    setAnchorDate(d);
  };

  const fetchEyeTests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const { start, end } = getDateRange();
      if (start instanceof Date && !isNaN(start)) params.append('startDate', start.toISOString().split('T')[0]);
      if (end instanceof Date && !isNaN(end)) params.append('endDate', end.toISOString().split('T')[0]);
      if (filterStatus) params.append('status', filterStatus);

      const { data } = await axios.get(`${baseURL}/api/eye-test/all?${params}`, { withCredentials: true });
      setEyeTests(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch eye tests');
    } finally {
      setLoading(false);
    }
  };

  const updateTestStatus = async (testId, newStatus) => {
    setUpdatingId(testId);
    try {
      await axios.put(
        `${baseURL}/api/eye-test/status/${testId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Marked as ${newStatus}`);
      setEyeTests((prev) => prev.map((t) => t._id === testId ? { ...t, status: newStatus } : t));
      if (selectedTest?._id === testId) setSelectedTest((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Eye Test Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{eyeTests.length} appointment{eyeTests.length !== 1 ? 's' : ''} in view</p>
        </div>
        <button onClick={fetchEyeTests} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-5 flex-wrap">

        {/* View mode pills */}
        <div className="flex items-center gap-1.5">
          {['week', 'month', 'custom'].map((mode) => (
            <button
              key={mode}
              onClick={() => { setFilterMode(mode); if (mode !== 'custom') setCustomRange([null, null]); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
                filterMode === mode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-2">
          {filterMode !== 'custom' && (
            <button onClick={() => shiftAnchor(-1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronPrev /></button>
          )}
          {filterMode === 'custom' ? (
            <DatePicker
              selectsRange
              startDate={customRange[0]}
              endDate={customRange[1]}
              onChange={(update) => setCustomRange(update)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 w-48"
              dateFormat="MMM d, yyyy"
              isClearable
              placeholderText="Pick date range"
            />
          ) : (
            <DatePicker
              selected={anchorDate}
              onChange={setAnchorDate}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 w-36"
              dateFormat={filterMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy'}
              showMonthYearPicker={filterMode === 'month'}
            />
          )}
          {filterMode !== 'custom' && (
            <button onClick={() => shiftAnchor(1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronNext /></button>
          )}
          {(filterMode === 'week' || filterMode === 'month') && (
            <span className="text-xs font-medium text-gray-500">{getRangeLabel()}</span>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs font-medium text-gray-500">Status</span>
          {['', 'Scheduled', 'Completed', 'Cancelled', 'No Show'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterStatus === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : eyeTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-medium">No eye tests found for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {['Date', 'Time', 'Patient', 'Contact', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eyeTests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-800">
                      {test.testDate ? format(new Date(test.testDate), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-700">
                      {test.displayTime || test.timeSlot || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{test.patientName}</p>
                      <p className="text-xs text-gray-400">{test.age} yrs</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-700">{test.email}</p>
                      <p className="text-xs text-gray-400">{test.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={test.status} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {test.status === 'Scheduled' && (
                          <>
                            <button
                              title="Mark Completed"
                              disabled={updatingId === test._id}
                              onClick={() => updateTestStatus(test._id, 'Completed')}
                              className="p-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                            >
                              <CheckIcon />
                            </button>
                            <button
                              title="Mark No Show"
                              disabled={updatingId === test._id}
                              onClick={() => updateTestStatus(test._id, 'No Show')}
                              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                            >
                              <XIcon />
                            </button>
                          </>
                        )}
                        <button
                          title="View Details"
                          onClick={() => setSelectedTest(test)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <EyeIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right-side drawer */}
      {selectedTest && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedTest(null)} />
          <div className="fixed right-0 top-0 z-50 h-full w-[420px] bg-white shadow-2xl flex flex-col">

            {/* Drawer header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Appointment Details</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {selectedTest.testDate ? format(new Date(selectedTest.testDate), 'dd MMM yyyy') : '—'}
                  {' · '}
                  {selectedTest.displayTime || selectedTest.timeSlot || ''}
                </p>
              </div>
              <button onClick={() => setSelectedTest(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors mt-0.5">
                <XIcon />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Status + actions */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedTest.status} />
                {selectedTest.status === 'Scheduled' && (
                  <div className="flex gap-2">
                    <button
                      disabled={updatingId === selectedTest._id}
                      onClick={() => updateTestStatus(selectedTest._id, 'Completed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <CheckIcon /> Complete
                    </button>
                    <button
                      disabled={updatingId === selectedTest._id}
                      onClick={() => updateTestStatus(selectedTest._id, 'No Show')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XIcon /> No Show
                    </button>
                  </div>
                )}
              </div>

              {/* Patient info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                <DetailRow label="Patient Name"    value={selectedTest.patientName} />
                <DetailRow label="Age"             value={selectedTest.age ? `${selectedTest.age} years` : null} />
                <DetailRow label="Email"           value={selectedTest.email} />
                <DetailRow label="Phone"           value={selectedTest.phoneNumber} />
              </div>

              {/* Medical info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                <DetailRow label="Current Eyewear"   value={selectedTest.currentEyewear} />
                <DetailRow label="Previous Eye Test" value={selectedTest.previousEyeTest ? 'Yes' : 'No'} />
                {selectedTest.prescription && (
                  <div className="col-span-2">
                    <DetailRow label="Prescription" value={selectedTest.prescription} />
                  </div>
                )}
              </div>

              {selectedTest.specialNotes && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Special Notes</p>
                  <p className="text-sm text-gray-800">{selectedTest.specialNotes}</p>
                </div>
              )}

              {selectedTest.testResults && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Test Results</p>
                  <p className="text-sm text-gray-800">{selectedTest.testResults}</p>
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedTest(null)}
                className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EyeTestManagement;
