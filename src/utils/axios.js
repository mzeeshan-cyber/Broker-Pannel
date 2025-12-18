import { openSnackbar } from 'api/snackbar';
import axios from 'axios';
import { decryptToken } from './tokenUtils';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

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
    // if (error.response.status === 401 && !window.location.href.includes('/login')) {
    //   window.location.pathname = '/maintenance/500';
    // }
    openSnackbar({
      open: true,
      message: error.message || 'data is not fetched',
      variant: 'alert',
      alert: { color: 'error' }
    });
    return Promise.reject((error.message) || 'Wrong Services');
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
