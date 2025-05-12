// src/providers/AuthProvider.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess,logout } from '@/redux/slice/authSlice';
import axios from 'axios';
import { baseURL } from '@/url';
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/me`,{withCredentials:true});
        dispatch(loginSuccess({ user: res.data.user }));
      } catch (err) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
