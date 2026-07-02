// src/providers/AuthProvider.jsx
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess,logout } from '@/redux/slice/authSlice';
import { api } from '@/lib/axios';
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/auth/me');
        dispatch(loginSuccess({ user: res.data.user }));
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.log(err);
        }
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
