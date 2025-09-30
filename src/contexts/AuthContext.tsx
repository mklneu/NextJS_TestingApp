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
  user: resUser | null;
  setUser: React.Dispatch<React.SetStateAction<resUser | null>>;
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
  const [user, setUser] = useState<resUser | null>(null);

  // Luôn fetch lại user info mỗi khi isLoggedIn chuyển thành true
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    if (isAuthenticated()) {
      const fetchUserInfo = async () => {
        const account = await getAccount();
        setUser(account?.user || null);
        setUserName(account?.user?.username || null);
        setUserRole(account.user.role?.name || null);
        setUserId(account?.user?.id || null);
      };
      fetchUserInfo();
    } else {
      setUser(null);
      setUserName(null);
      setUserRole(null);
      setUserId(null);
    }
  }, [isLoggedIn]);

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
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
