import axios from "axios";
// import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Gửi cookie với request
});

export default axiosInstance;
