// src/providers/AuthProvider.jsx
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess,logout } from '@/redux/slice/authSlice';
import axios from 'axios';
import { baseURL } from '@/url';
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: res.data.user }));
      } catch (err) {
        console.log(err);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return children;
};

export default AuthProvider;
