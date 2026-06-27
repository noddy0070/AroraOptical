import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseURL } from '@/url';

export default function EyeTests() {
  const { user } = useSelector((state) => state.auth);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/api/eye-test/user-tests`, {
          withCredentials: true,
        });
        setTests(res.data || []);
      } catch (err) {
        console.error('Failed to load eye tests', err);
        setError('Failed to load eye tests');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [user]);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return <p className="text-center mt-8 text-gray-500 text-regularTextPhone md:text-regularText">Please log in to view your eye tests.</p>;
  }

  return (
    <>
      {loading && (
        <p className="text-center mt-8 text-regularTextPhone md:text-regularText">
          Loading scheduled eye tests...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center mt-4 text-regularTextPhone md:text-regularText">
          {error}
        </p>
      )}
      {!loading && tests.length === 0 && !error && (
        <div className='flex flex-col items-center justify-center py-[12vw] md:py-12 text-gray-400'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-[16vw] md:w-16 h-[16vw] md:h-16 mb-[4vw] md:mb-4 opacity-40' fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className='font-semibold text-regularTextPhone md:text-regularText text-gray-500'>No scheduled eye tests</p>
          <p className='text-smallTextPhone md:text-sm text-gray-400 mt-[2vw] md:mt-2'>Book a free eye test and it will appear here.</p>
        </div>
      )}
      {tests.map((test) => (
        <div
          key={test._id}
          className="mt-6 md:mt-4 p-[4vw] md:p-4 bg-gray-50 rounded-[4vw] md:rounded-lg flex flex-col gap-[2vw] md:gap-2"
        >
          <div className="flex flex-col md:flex-row justify-between gap-[2vw] md:gap-0">
            <div>
              <h3 className="font-bold text-h5TextPhone md:text-lg">
                {test.patientName}
              </h3>
              <p className="text-smallTextPhone md:text-sm text-gray-600">
                {formatDate(test.testDate)}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-smallTextPhone md:text-sm text-gray-600">
                Time: {test.displayTime}
              </p>
              <p className="text-smallTextPhone md:text-sm text-gray-600">
                Status: <span className="font-semibold">{test.status}</span>
              </p>
            </div>
          </div>
          {test.specialNotes && (
            <p className="text-smallTextPhone md:text-sm text-gray-700">
              Notes: {test.specialNotes}
            </p>
          )}
        </div>
      ))}
    </>
  );
}

