import axios from "axios";
// import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Gửi cookie với request
});

// Set Authorization header nếu đã có token trong localStorage (giữ đăng nhập khi reload)
const token =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;
