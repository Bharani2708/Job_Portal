import axios from "axios";

// Automatically ensure /api is appended even if user omits it in Render environment variable
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  url = url.trim().replace(/\/+$/, ""); // remove trailing slashes
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
