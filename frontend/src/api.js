import axios from "axios";

const API = axios.create({
  // Production single-service deployment uses the same origin.
  // Local development can still override this with REACT_APP_API_URL.
  baseURL: process.env.REACT_APP_API_URL || "/api"
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
