import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });

    // Lưu token vào localStorage hoặc cookies
    localStorage.setItem("access_token", response.data?.data?.access_token);

    console.log("Access Token:", response.data?.data?.access_token);

    // Set token cho tất cả request tiếp theo
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data?.data?.access_token}`;  

    console.log("✅ Login successful:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error in login:", error);
    toast.error("❌ Login failed!");
    throw error;
  }
};

export const logout = () => {
  // Xóa token từ localStorage
  localStorage.removeItem("access_token");

  // Xóa Authorization header
  delete axiosInstance.defaults.headers.common["Authorization"];

  // Thông báo logout thành công
  toast.success("Logged out successfully");

  // Tùy chọn: Redirect về trang login
  // window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};
