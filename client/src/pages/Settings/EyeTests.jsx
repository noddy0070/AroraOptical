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
        <p className="text-center mt-8 text-gray-500 text-regularTextPhone md:text-regularText">
          You have no scheduled eye tests.
        </p>
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

