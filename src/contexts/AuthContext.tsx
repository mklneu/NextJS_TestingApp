"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getAccount, isAuthenticated } from "@/services/AuthServices";
import { getPatientById } from "@/services/PatientServices";
import { Appointment, resUser } from "@/types/frontend";

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
  appointmentsUpdateTrigger: number;
  setAppointmentsUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  STORAGE_BASE_URL: string;
  folderName: string;
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
  const [appointmentsUpdateTrigger, setAppointmentsUpdateTrigger] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "http://localhost:8080/storage";
  const folderName = "test-results";

  // Luôn fetch lại user info mỗi khi isLoggedIn chuyển thành true
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    if (isAuthenticated()) {
      const fetchUserInfo = async () => {
        const account = await getAccount();
        setUserId(account?.user?.id || null);
        setUserName(account?.user?.username || null);
        setUserRole(account.user.role?.name || null);

        if (account?.user?.id) {
          const resUserById = await getPatientById(account.user.id);
          // console.log("Fetched user by ID:", resUserById);
          setUser(resUserById || null);
        }

        // console.log("Fetched user in AuthContext:", account?.user);
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
        appointmentsUpdateTrigger,
        setAppointmentsUpdateTrigger,
        appointments,
        setAppointments,
        STORAGE_BASE_URL,
        folderName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
