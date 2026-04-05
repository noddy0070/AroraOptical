import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import LoginImg from '../../assets/images/LoginImg.png';
import { TransitionLink } from '../../Routes/TransitionLink';
import { baseURL } from '@/url';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = { password: '', confirm: '' };
    let ok = true;
    if (!password) {
      next.password = 'Password is required';
      ok = false;
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
      ok = false;
    }
    if (password !== confirm) {
      next.confirm = 'Passwords do not match';
      ok = false;
    }
    setErrors(next);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Invalid reset link. Request a new one from the forgot password page.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/reset-password`,
        { token, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.success) {
        navigate('/login', { replace: true, state: { resetMessage: res.data.message } });
      } else {
        setError(res.data.message || 'Could not reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]">
        <div className="px-[4.5vw] md:px-[4vw] w-full md:w-[47.375vw] md:max-w-[762px] text-center font-roboto text-regularTextPhone md:text-regularText">
          <h3 className="font-dyeLine text-h3TextPhone md:text-h3Text font-bold mb-[2vw]">Invalid link</h3>
          <p className="mb-[4vw]">This password reset link is missing or invalid.</p>
          <TransitionLink to="/forgot-password">
            <span className="underline">Request a new reset link</span>
          </TransitionLink>
          <span className="mx-2">|</span>
          <TransitionLink to="/login">
            <span className="underline">Login</span>
          </TransitionLink>
        </div>
        <div className="w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden">
          <img className="h-full w-full" src={LoginImg} alt="" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-[4vw] my-auto pt-[20vh] md:pt-[4vw]">
      <div className="px-[4.5vw] md:px-[4vw] w-full md:w-[47.375vw] md:max-w-[762px]">
        <div className="flex flex-col h-full">
          <div className="w-full mx-auto">
            <h3 className="font-dyeLine text-h3TextPhone md:text-h3Text text-center leading-[120%] mb-[1vw] md:mb-[1.5vw] font-bold">
              Set new password
            </h3>
            <p className="font-roboto text-mediumTextPhone md:text-mediumText text-center leading-[150%] mb-[4vw] md:mb-[2vw]">
              Choose a new password for your account.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[2vw] md:gap-[.5vw] justify-center font-roboto text-regularTextPhone md:text-regularText"
            >
              <div className="relative">
                <input
                  className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${errors.password ? 'border-red-500' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: '' }));
                    setError('');
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[2vw] md:right-[.75vw] top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <VisibilityOff className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw]" />
                  ) : (
                    <Visibility className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw]" />
                  )}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <input
                  className={`border-[1.5px] p-[2vw] md:p-[.75vw] border-black w-full placeholder:text-[#505050] rounded-[2vw] md:rounded-[.5vw] ${errors.confirm ? 'border-red-500' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setErrors((p) => ({ ...p, confirm: '' }));
                    setError('');
                  }}
                />
                {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border p-[2vw] md:p-[.75vw] rounded-[8vw] mt-[2vw] md:mt-[1vw] md:rounded-[2vw] bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving…' : 'Update password'}
              </button>
            </form>
            {error && <p className="text-red-500 text-center mt-[2vw]">{error}</p>}
            <div className="font-roboto text-regularTextPhone md:text-regularText mt-[2vw]">
              <p className="text-center leading-[150%]">
                <TransitionLink to="/login">
                  <span className="underline">Back to login</span>
                </TransitionLink>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[44.625vw] max-w-[714px] hidden md:block h-auto rounded-[1.25vw] overflow-hidden">
        <img className="h-full w-full" src={LoginImg} alt="" />
      </div>
    </div>
  );
}
