import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-lg mb-2">Your payment was successful and your order has been placed.</p>
      <p className="text-md text-gray-500">You will be redirected to the home page in 10 seconds...</p>
    </div>
  );
};

export default ThankYou; 