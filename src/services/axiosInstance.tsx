import axios from "axios";
// import { refreshToken, logout } from "./AuthServices";

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

// --- Interceptor tự động refresh token ---
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newToken = await refreshToken();
//         processQueue(null, newToken);
//         originalRequest.headers["Authorization"] = "Bearer " + newToken;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         processQueue(err, null);

//         // --- QUAN TRỌNG: Logout và redirect về login ---
//         // await logout();
//         // if (typeof window !== "undefined") {
//         //   window.location.href = "/login";
//         // }
//         // ---------------------------------------------

//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
