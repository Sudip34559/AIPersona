import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // still sends cookies
});

// Request interceptor → Add access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 411) {
      console.log(error.response);

      // Clear local storage
      localStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // Redirect to login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
