"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserById } from "@/services/UserServices";
import InfoTab from "./InfoTab";
import Sidebar from "./Sidebar";
import AppointmentsTab from "./AppointmentsTab";
import MedicalTab from "./MedicalTab";

const ProfilePage = () => {
  const { isLoggedIn, userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "info" | "appointments" | "medical"
  >(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("profileActiveTab");
      if (
        stored === "info" ||
        stored === "appointments" ||
        stored === "medical"
      ) {
        return stored;
      }
    }
    return "info";
  });

  // Sync activeTab to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("profileActiveTab", activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const res = await getUserById(userId);
          setUser(res);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10">Đang tải thông tin...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar nav */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Main content */}
        <main className="flex-1">
          {activeTab === "info" && <InfoTab />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "medical" && <MedicalTab />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
