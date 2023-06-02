import axios from "axios";
import { logout } from "../redux/reducers/auth";
import { store } from "../redux/store";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.headers["Api-Key"] = process.env.REACT_APP_API_KEY;
axios.defaults.headers.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Access directly to store to get access token
    const token = store?.getState()?.auth?.user?.token || null;

    if (!config.headers.Authorization && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    if (error.response.data.statusCode === 401) {
      // Unauthorized, execute logout
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);
