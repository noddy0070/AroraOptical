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
    <div className="flex flex-col items-center justify-center min-h-screen px-[5vw] md:px-0">
      <h1 className="text-h2TextPhone md:text-4xl font-bold mb-[4vw] md:mb-4 text-center">Thank You for Your Purchase!</h1>
      <p className="text-regularTextPhone md:text-lg mb-[2vw] md:mb-2 text-center">Your payment was successful and your order has been placed.</p>
      <p className="text-smallTextPhone md:text-md text-gray-500 text-center">You will be redirected to the home page in 10 seconds...</p>
    </div>
  );
};

export default ThankYou; 