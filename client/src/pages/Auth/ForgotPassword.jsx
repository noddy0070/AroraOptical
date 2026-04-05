import React, { useState } from 'react';
import axios from 'axios';
import LoginImg from '../../assets/images/LoginImg.png';
import { TransitionLink } from '../../Routes/TransitionLink';
import { baseURL } from '@/url';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/forgot-password`,
        { email: email.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]">
      <div className="px-[4.5vw] md:px-[4vw] w-full md:w-[47.375vw] md:max-w-[762px]">
        <div className="flex flex-col h-full">
          <div className="w-full mx-auto">
            <h3 className="font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold">
              Forgot password
            </h3>
            <p className="font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]">
              Enter your email and we will send you a link to reset your password.
            </p>
            <div className="flex flex-col gap-[4vw] md:gap-[1.5vw]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText"
              >
                <div>
                  <input
                    className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${emailError ? 'border-red-500' : ''}`}
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                      setError('');
                    }}
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              {success && (
                <p className="text-center text-green-700 font-roboto text-regularTextPhone md:text-regularText">
                  If an account exists for that email, you will receive password reset instructions shortly.
                  </p>
              )}
              {error && <p className="text-red-500 text-center font-roboto text-regularTextPhone md:text-regularText">{error}</p>}
              <div className="font-roboto text-regularTextPhone md:text-regularText">
                <p className="text-center leading-[150%]">
                  <TransitionLink to="/login">
                    <span className="underline">Back to login</span>
                  </TransitionLink>
                  {' | '}
                  <TransitionLink to="/">
                    <span className="underline">Home</span>
                  </TransitionLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden">
        <img className="h-full w-full" src={LoginImg} alt="Forgot password illustration" />
      </div>
    </div>
  );
}
