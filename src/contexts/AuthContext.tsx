"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { isAuthenticated } from "@/services/AuthServices";

// Định nghĩa kiểu dữ liệu cho context
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
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

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Lấy userName từ localStorage nếu đã đăng nhập
    if (isAuthenticated()) {
      setUserName(localStorage.getItem("userName"));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
