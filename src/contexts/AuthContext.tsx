"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getAccount, isAuthenticated } from "@/services/AuthServices";

// Định nghĩa kiểu dữ liệu cho context
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  userId: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
};

// Tạo context với giá trị mặc định
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Hook để sử dụng context một cách dễ dàng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component bao bọc ứng dụng
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Lấy userName từ localStorage nếu đã đăng nhập
    // if (isAuthenticated()) {
    //   setUserName(localStorage.getItem("userName"));
    // }

    if (isAuthenticated()) {
      // Lấy thông tin user thông qua API
      const fetchUserInfo = async () => {
        // Giả sử bạn có hàm getUserInfo trong AuthServices
        const account = await getAccount();
        setUserName(account?.user?.username || null);
        setUserRole(account.user.role?.name || null);
        setUserId(account?.user?.id || null);
        console.log(">>> user id", account?.user?.id);
        console.log(">>> account in AuthContext", account.user.role?.name);
        // setUserName(userInfo?.username || null);
      };
      fetchUserInfo();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userName,
        setUserName,
        userRole,
        setUserRole,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
