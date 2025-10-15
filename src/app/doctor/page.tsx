"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { FaUserClock, FaCalendarAlt } from "react-icons/fa";

const DoctorDashboardPage = () => {
  const { user } = useAuth();

  // Danh sách các mục điều hướng cho bác sĩ
  const navItems = [
    {
      href: "/doctor/examinations",
      icon: <FaUserClock className="w-10 h-10 text-white" />,
      title: "Bệnh nhân chờ khám",
      description:
        "Xem danh sách bệnh nhân có lịch hẹn đã xác nhận và bắt đầu quá trình khám.",
      bgColor: "bg-blue-500",
    },
    {
      href: "/doctor/schedule", // Giả sử bạn sẽ có trang này trong tương lai
      icon: <FaCalendarAlt className="w-10 h-10 text-white" />,
      title: "Quản lý lịch hẹn",
      description: "Xem, xác nhận, hoặc hủy các lịch hẹn đã được đặt.",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header chào mừng */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">
            Chào mừng trở lại, Bác sĩ {user?.fullName || ""}!
          </h1>
          <p className="mt-2 text-indigo-100">
            Đây là trang tổng quan dành cho bạn. Hãy chọn một tác vụ bên dưới để
            bắt đầu.
          </p>
        </div>

        {/* Các thẻ điều hướng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navItems.map((item) => (
            <Link href={item.href} key={item.title}>
              <div className="group bg-white rounded-lg shadow-md p-6 flex flex-col items-start h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div
                  className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${item.bgColor}`}
                >
                  {item.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 flex-grow">{item.description}</p>
                <div className="mt-4 text-blue-600 font-semibold group-hover:underline">
                  Đi đến trang &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
