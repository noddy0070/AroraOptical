import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '@/url';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

const EyeTestManagement = () => {
  const [eyeTests, setEyeTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('week'); // week | month | custom
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [customRange, setCustomRange] = useState([null, null]);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetchEyeTests();
  }, [filterMode, anchorDate, customRange, filterStatus]);

  const getDateRange = () => {
    if (filterMode === 'month') {
      return {
        start: startOfMonth(anchorDate),
        end: endOfMonth(anchorDate),
      };
    }

    if (filterMode === 'custom') {
      const [start, end] = customRange;
      return { start, end };
    }

    // week (default)
    return {
      start: startOfWeek(anchorDate, { weekStartsOn: 1 }),
      end: endOfWeek(anchorDate, { weekStartsOn: 1 }),
    };
  };

  const getRangeLabel = () => {
    const { start, end } = getDateRange();
    if (!(start instanceof Date) || Number.isNaN(start.getTime())) return '';
    if (!(end instanceof Date) || Number.isNaN(end.getTime())) return '';

    // Same month -> "Mar 01–Mar 07, 2026"; cross-month -> "Mar 30, 2026–Apr 05, 2026"
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    return sameMonth
      ? `${format(start, 'MMM dd')}–${format(end, 'MMM dd, yyyy')}`
      : `${format(start, 'MMM dd, yyyy')}–${format(end, 'MMM dd, yyyy')}`;
  };

  const IconButton = ({ title, onClick, className = '', children, disabled = false }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-transparent transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </button>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const InfoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16v-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M12 8h.01"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  const fetchEyeTests = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      const { start, end } = getDateRange();

      if (start instanceof Date && !Number.isNaN(start.getTime())) {
        queryParams.append('startDate', start.toISOString().split('T')[0]);
      }
      if (end instanceof Date && !Number.isNaN(end.getTime())) {
        queryParams.append('endDate', end.toISOString().split('T')[0]);
      }

      if (filterStatus) queryParams.append('status', filterStatus);

      const response = await axios.get(`${baseURL}/api/eye-test/all?${queryParams.toString()}`, {
        withCredentials: true,
      });
      setEyeTests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch eye tests');
    } finally {
      setLoading(false);
    }
  };

  const updateTestStatus = async (testId, newStatus, testResults = null) => {
    try {
      await axios.put(
        `${baseURL}/api/eye-test/status/${testId}`,
        { status: newStatus, testResults },
        { withCredentials: true }
      );

      toast.success('Test status updated successfully');
      fetchEyeTests();
      setSelectedTest(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to update test status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'No Show': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Eye Test Management</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">View</label>
          <select
            value={filterMode}
            onChange={(e) => {
              const next = e.target.value;
              setFilterMode(next);
              if (next !== 'custom') setCustomRange([null, null]);
            }}
            className="p-2 border rounded"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {filterMode === 'month'
              ? 'Select Month'
              : filterMode === 'custom'
              ? 'Select Range'
              : 'Select Week'}
          </label>
          {filterMode === 'custom' ? (
            <DatePicker
              selectsRange
              startDate={customRange[0]}
              endDate={customRange[1]}
              onChange={(update) => setCustomRange(update)}
              className="p-2 border rounded"
              dateFormat="MMMM d, yyyy"
              isClearable
            />
          ) : (
            <DatePicker
              selected={anchorDate}
              onChange={setAnchorDate}
              className="p-2 border rounded"
              dateFormat={filterMode === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy'}
              showMonthYearPicker={filterMode === 'month'}
            />
          )}
          {(filterMode === 'week' || filterMode === 'month') && (
            <div className="mt-1 text-xs text-gray-500">
              Showing: <span className="font-medium text-gray-700">{getRangeLabel()}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
      </div>

      {/* Eye Tests Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eyeTests.map((test) => (
                <tr key={test._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">
                      {test.testDate ? format(new Date(test.testDate), 'dd MMM yyyy') : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{test.displayTime || test.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{test.patientName}</div>
                    <div className="text-xs text-gray-500">{test.age} years</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{test.email}</div>
                    <div className="text-xs text-gray-500">{test.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {test.status === 'Scheduled' && (
                        <>
                          <IconButton
                            title="Mark as Completed"
                            onClick={() => updateTestStatus(test._id, 'Completed')}
                            className="text-green-700 hover:bg-green-50"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            title="Mark as No Show"
                            onClick={() => updateTestStatus(test._id, 'No Show')}
                            className="text-red-700 hover:bg-red-50"
                          >
                            <XIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        title="View Details"
                        onClick={() => setSelectedTest(test)}
                        className="text-blue-700 hover:bg-blue-50"
                      >
                        <InfoIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Test Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Test Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium">Patient Name</p>
                <p>{selectedTest.patientName}</p>
              </div>
              <div>
                <p className="font-medium">Age</p>
                <p>{selectedTest.age}</p>
              </div>
              <div>
                <p className="font-medium">Current Eyewear</p>
                <p>{selectedTest.currentEyewear}</p>
              </div>
              <div>
                <p className="font-medium">Previous Eye Test</p>
                <p>{selectedTest.previousEyeTest ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {selectedTest.specialNotes && (
              <div className="mb-4">
                <p className="font-medium">Special Notes</p>
                <p className="text-gray-600">{selectedTest.specialNotes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EyeTestManagement; 