import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/checkout');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-[5vw] md:px-0 gap-[4vw] md:gap-6">
      <div className="flex items-center justify-center w-[20vw] h-[20vw] md:w-24 md:h-24 rounded-full bg-red-100">
        <svg className="w-[10vw] h-[10vw] md:w-12 md:h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-h2TextPhone md:text-4xl font-bold text-center text-red-600">
        Payment Failed
      </h1>

      <p className="text-regularTextPhone md:text-lg text-center text-gray-700 max-w-md">
        We couldn't process your payment. No amount has been deducted from your account.
      </p>

      <p className="text-smallTextPhone md:text-sm text-gray-500 text-center">
        Redirecting you back to checkout in {countdown} second{countdown !== 1 ? 's' : ''}...
      </p>

      <div className="flex flex-col md:flex-row gap-[3vw] md:gap-4 w-full md:w-auto items-center">
        <button
          onClick={() => navigate('/checkout')}
          className="w-[80vw] md:w-auto px-8 py-3 bg-black text-white font-roboto text-regularTextPhone md:text-regularText rounded-[2vw] md:rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="w-[80vw] md:w-auto px-8 py-3 border border-black text-black font-roboto text-regularTextPhone md:text-regularText rounded-[2vw] md:rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
