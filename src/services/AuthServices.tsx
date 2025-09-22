import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

// Cập nhật hàm login để nhận setIsLoggedIn và setUserName từ context
export const login = async (
  username: string,
  password: string,
  setIsLoggedIn?: (value: boolean) => void,
  setUserName?: (value: string | null) => void
) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });

    // Lưu token vào localStorage hoặc cookies
    localStorage.setItem("access_token", response.data?.data?.access_token);

    // Lưu username (hoặc tên người dùng) nếu có
    if (response.data?.data?.user?.username) {
      localStorage.setItem("userName", response.data?.data?.user?.username);
    }

    console.log("Access Token:", response.data?.data?.access_token);

    // Set token cho tất cả request tiếp theo
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data?.data?.access_token}`;

    // Cập nhật state toàn cục nếu được cung cấp
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }

    if (setUserName && response.data?.data?.user?.username) {
      setUserName(response.data?.data?.user?.username);
      console.log("User Name:", response.data?.data?.user?.username);
    }

    console.log("✅ Login successful:", response.data);
    toast.success("Đăng nhập thành công!");

    return response.data;
  } catch (error) {
    console.error("❌ Error in login:", error);
    toast.error("❌ Đăng nhập thất bại!");
    throw error;
  }
};

// Cập nhật hàm logout để nhận setIsLoggedIn và setUserName từ context
export const logout = (
  setIsLoggedIn?: (value: boolean) => void,
  setUserName?: (value: string | null) => void
) => {
  // Xóa token từ localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("userName");

  // Xóa Authorization header
  delete axiosInstance.defaults.headers.common["Authorization"];

  // Cập nhật state toàn cục nếu được cung cấp
  if (setIsLoggedIn) {
    setIsLoggedIn(false);
  }

  if (setUserName) {
    setUserName(null);
  }

  // Thông báo logout thành công
  toast.success("Đăng xuất thành công");

  // Tùy chọn: Redirect về trang login
  // window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const getUserName = () => {
  return localStorage.getItem("userName");
};
