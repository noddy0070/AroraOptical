import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseURL } from '@/url';

const TABS = ['Upcoming', 'Missed', 'Completed', 'Cancelled'];

const statusColors = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
  'No Show':  'bg-yellow-100 text-yellow-700',
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

export default function EyeTests() {
  const { user } = useSelector((state) => state.auth);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [cancelling, setCancelling] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const fetchTests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/eye-test/user-tests`, { withCredentials: true });
      setTests(res.data || []);
    } catch (err) {
      console.error('Failed to load eye tests', err);
      setError('Failed to load eye tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(); }, [user]);

  const now = new Date();

  const tabTests = {
    Upcoming:  tests.filter(t => t.status === 'Scheduled' && new Date(t.testDate) >= now),
    Missed:    tests.filter(t => (t.status === 'Scheduled' && new Date(t.testDate) < now) || t.status === 'No Show'),
    Completed: tests.filter(t => t.status === 'Completed'),
    Cancelled: tests.filter(t => t.status === 'Cancelled'),
  };

  const handleCancel = async (testId) => {
    setCancelling(testId);
    try {
      await axios.put(`${baseURL}/api/eye-test/cancel/${testId}`, {}, { withCredentials: true });
      setConfirmCancel(null);
      await fetchTests();
    } catch (err) {
      console.error('Cancel failed', err);
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return <p className="text-center mt-8 text-gray-500 text-regularTextPhone md:text-regularText">Please log in to view your eye tests.</p>;
  }

  const displayed = tabTests[activeTab] || [];

  return (
    <div className="flex flex-col gap-[4vw] md:gap-[1vw]">
      <h2 className="font-dyeLine font-bold text-h3TextPhone md:text-h3Text">Eye Tests</h2>

      {/* Tabs */}
      <div className="flex gap-[1vw] md:gap-0 border-b border-gray-200 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-[2vw] md:pb-[.5vw] px-[3vw] md:px-[.75vw] text-smallTextPhone md:text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0
              ${activeTab === tab ? 'text-[#030972]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
            {tabTests[tab]?.length > 0 && (
              <span className={`ml-[1.5vw] md:ml-1.5 text-[2.5vw] md:text-[.6vw] px-[1.5vw] md:px-[.4vw] py-[.3vw] md:py-[.05vw] rounded-full ${activeTab === tab ? 'bg-[#030972] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {tabTests[tab].length}
              </span>
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[.5vw] md:h-0.5 bg-[#030972] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center py-[8vw] md:py-8 text-regularTextPhone md:text-regularText text-gray-500">Loading…</p>
      )}
      {error && (
        <p className="text-red-500 text-center py-[4vw] md:py-4 text-regularTextPhone md:text-regularText">{error}</p>
      )}

      {!loading && !error && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-[12vw] md:py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[14vw] md:w-14 h-[14vw] md:h-14 mb-[3vw] md:mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-semibold text-regularTextPhone md:text-regularText text-gray-500">
            No {activeTab.toLowerCase()} eye tests
          </p>
          {activeTab === 'Upcoming' && (
            <p className="text-smallTextPhone md:text-sm text-gray-400 mt-[2vw] md:mt-2">
              Book a free eye test and it will appear here.
            </p>
          )}
        </div>
      )}

      {displayed.map((test) => (
        <div
          key={test._id}
          className="p-[4vw] md:p-4 bg-gray-50 rounded-[3vw] md:rounded-xl border border-gray-200 flex flex-col gap-[3vw] md:gap-3"
        >
          <div className="flex flex-col md:flex-row justify-between gap-[2vw] md:gap-4">
            <div className="flex flex-col gap-[1.5vw] md:gap-1">
              <div className="flex items-center gap-[2vw] md:gap-2 flex-wrap">
                <h3 className="font-bold text-h5TextPhone md:text-base">{test.patientName}</h3>
                <span className={`text-[2.5vw] md:text-[.6vw] px-[2vw] md:px-2 py-[.3vw] md:py-0.5 rounded-full font-medium ${statusColors[test.status] || 'bg-gray-100 text-gray-600'}`}>
                  {test.status}
                </span>
              </div>
              <p className="text-smallTextPhone md:text-sm text-gray-600">{formatDate(test.testDate)}</p>
              <p className="text-smallTextPhone md:text-sm text-gray-600">{test.displayTime}</p>
              {test.specialNotes && (
                <p className="text-smallTextPhone md:text-sm text-gray-500 italic">"{test.specialNotes}"</p>
              )}
              {test.status === 'Cancelled' && test.cancellationReason && (
                <p className="text-smallTextPhone md:text-sm text-gray-500">
                  Reason: {test.cancellationReason}
                </p>
              )}
            </div>

            {activeTab === 'Upcoming' && (
              <div className="flex items-start">
                <button
                  onClick={() => setConfirmCancel(test._id)}
                  className="text-smallTextPhone md:text-sm text-red-500 border border-red-300 hover:bg-red-50 rounded-[2vw] md:rounded-lg px-[3vw] md:px-3 py-[1.5vw] md:py-1.5 transition-colors font-medium"
                >
                  Cancel Test
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Cancel confirmation dialog */}
      {confirmCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setConfirmCancel(null)}
        >
          <div
            className="bg-white rounded-[4vw] md:rounded-2xl p-[6vw] md:p-6 mx-[6vw] md:mx-0 md:w-[28vw] flex flex-col gap-[4vw] md:gap-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-h5TextPhone md:text-lg">Cancel Eye Test</h3>
            <p className="text-smallTextPhone md:text-sm text-gray-600">
              Are you sure you want to cancel this appointment? This cannot be undone.
            </p>
            <div className="flex gap-[3vw] md:gap-3 justify-end">
              <button
                onClick={() => setConfirmCancel(null)}
                className="px-[4vw] md:px-4 py-[2vw] md:py-2 text-smallTextPhone md:text-sm border border-gray-300 rounded-[2vw] md:rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep
              </button>
              <button
                onClick={() => handleCancel(confirmCancel)}
                disabled={cancelling === confirmCancel}
                className="px-[4vw] md:px-4 py-[2vw] md:py-2 text-smallTextPhone md:text-sm bg-red-500 text-white rounded-[2vw] md:rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {cancelling === confirmCancel ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
