import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

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
    // if (response.data?.data?.user?.username) {
    //   localStorage.setItem("userName", response.data?.data?.user?.username);
    // }

    const fetchAccount = async () => {
      try {
        const accountResponse = await axiosInstance.get("/auth/account", {
          headers: {
            Authorization: `Bearer ${response.data?.data?.access_token}`,
          },
        });
        console.log(">>>>>> data account", accountResponse.data.data);
        // if (accountResponse.data?.data?.user?.username) {
        //   localStorage.setItem(
        //     "userName",
        //     accountResponse.data?.data?.user?.username
        //   );
        // }
        if (setUserName) {
          setUserName(accountResponse.data?.data?.user?.username || null);
        }
      } catch (error) {
        console.error("❌ Error in fetchAccount:", error);
        toast.error("❌ Error while fetching account!");
      }
    };

    await fetchAccount();

    console.log("Access Token:", response.data?.data?.access_token);

    // Set token cho tất cả request tiếp theo
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data?.data?.access_token}`;

    // Cập nhật state toàn cục nếu được cung cấp
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }

    // if (setUserName && response.data?.data?.user?.username) {
    //   setUserName(response.data?.data?.user?.username);
    //   console.log("User Name:", response.data?.data?.user?.username);
    // }

    console.log("✅ Login successful:", response.data);
    toast.success(response.data?.message || "Đăng nhập thành công!");

    // Tùy chọn: Redirect về trang home
    // window.location.href = "/";

    return response.data;
  } catch (error) {
    console.error("❌ Error in login:", error);
    // toast.error("❌ Đăng nhập thất bại!");
    throw error;
  }
};

export const logout = async (
  setIsLoggedIn?: (value: boolean) => void,
  setUserName?: (value: string | null) => void
) => {
  try {
    const res = await axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    console.log("✅ Logout successful:", res.data);
  } catch (error) {
    // Có thể log lỗi hoặc bỏ qua nếu logout phía server thất bại
    console.error("❌ Error in logout API:", error);
  }

  // Xóa token từ localStorage
  localStorage.removeItem("access_token");

  // Xóa Authorization header
  delete axiosInstance.defaults.headers.common["Authorization"];

  // Cập nhật state toàn cục nếu được cung cấp
  if (setIsLoggedIn) setIsLoggedIn(false);
  if (setUserName) setUserName(null);

  toast.success("Đăng xuất thành công");
};

export const register = async (
  username: string,
  email: string,
  password: string,
  gender: string,
  address: string,
  age: number
) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      username,
      email,
      password,
      gender,
      address,
      age,
    });
    toast.success("Đăng ký thành công!");
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in register:", error);
    toast.error(err?.response?.data?.error);
    throw error;
  }
};

export const getAccount = async () => {
  try {
    const response = await axiosInstance.get("/auth/account", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    console.log(">>>>>> data account", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAccount:", error);
    toast.error("❌ Error while fetching account!");
  }
};

export const refreshToken = async () => {
  const response = await axiosInstance.get("/auth/refresh");
  const newToken = response.data?.data?.access_token;
  if (newToken) {
    localStorage.setItem("access_token", newToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newToken}`;
    return newToken;
  }
  throw new Error("No access token returned");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const getUserName = () => {
  return localStorage.getItem("userName");
};
