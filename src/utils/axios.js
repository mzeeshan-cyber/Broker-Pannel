import { openSnackbar } from 'api/snackbar';
import axios from 'axios';
import { decryptToken } from './tokenUtils';
import { logout } from 'store/reducers/authSlice';
import store, { persistor } from 'store/reducers/store';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

axiosServices.interceptors.request.use(
  async (config) => {
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    if (decryptedToken) {
      config.headers['Authorization'] = `Bearer ${decryptedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 419) {
      store.dispatch(logout());
      persistor.purge();
      localStorage.removeItem('token');
      openSnackbar({
        open: true,
        message: 'Session expired. Please login again.',
        variant: 'alert',
        alert: { color: 'error' }
      });

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    openSnackbar({
      open: true,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Something went wrong',
      variant: 'alert',
      alert: { color: 'error' }
    });

    return Promise.reject(error);
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};

export const fetcherDelete = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.delete(url, { ...config });
  return res;
};

export const fetcherUpdate = async (args) => {
  const [url, data, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.put(url, data, { ...config });

  return res.data;
};
export const fetcherPatch = async (args) => {
  const [url, data, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.patch(url, data, { ...config });

  return res.data;
};
