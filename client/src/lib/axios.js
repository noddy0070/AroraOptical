import axios from 'axios';
import { store } from '@/redux/store';
import { logout } from '@/redux/slice/authSlice';

const baseURL = import.meta.env.VITE_BASE_URL || '';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isAuthCheck = error?.config?.url?.includes('/auth/me');

    // A 401 on /auth/me just means "not logged in" — AuthProvider handles that itself.
    // Otherwise, if the store thought we were logged in, the session just expired/was
    // invalidated server-side: clear it and send the user to log back in.
    if (status === 401 && !isAuthCheck && store.getState().auth.isAuthenticated) {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
