import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const EyeTestManagement = () => {
  const [eyeTests, setEyeTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetchEyeTests();
  }, [filterDate, filterStatus]);

  const fetchEyeTests = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filterDate) {
        queryParams.append('date', filterDate.toISOString().split('T')[0]);
      }
      if (filterStatus) {
        queryParams.append('status', filterStatus);
      }

      const response = await fetch(`/api/eye-test/all?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setEyeTests(data);
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch eye tests');
    } finally {
      setLoading(false);
    }
  };

  const updateTestStatus = async (testId, newStatus, testResults = null) => {
    try {
      const response = await fetch(`/api/eye-test/status/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          testResults,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Test status updated successfully');
      fetchEyeTests();
      setSelectedTest(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update test status');
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
          <label className="block text-sm font-medium mb-1">Filter by Date</label>
          <DatePicker
            selected={filterDate}
            onChange={setFilterDate}
            className="p-2 border rounded"
            dateFormat="MMMM d, yyyy"
          />
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
                    <div className="text-sm font-medium">{test.timeSlot}</div>
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
                          <button
                            onClick={() => updateTestStatus(test._id, 'Completed')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateTestStatus(test._id, 'No Show')}
                            className="text-red-600 hover:text-red-800"
                          >
                            No Show
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Details
                      </button>
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