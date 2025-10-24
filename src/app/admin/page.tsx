import React from "react";
import { BiSolidDashboard } from "react-icons/bi";

const AdminPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center 
    min-h-screen p-8 bg-gradient-to-br 
    from-slate-50 to-blue-50 text-center"
    >
      {/* Icon */}
      <div className="mb-6">
        <BiSolidDashboard className="size-40 text-gray-300" />
      </div>

      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
        Chào mừng đến Trang Quản trị
      </h1>

      {/* Mô tả */}
      <p className="text-lg text-slate-600 max-w-md">
        Hãy chọn một mục từ thanh điều hướng bên cạnh (sidebar) để bắt đầu quản
        lý hệ thống.
      </p>

      {/* (Tùy chọn) Thêm một vài gợi ý hoặc link nhanh */}
      {/* <div className="mt-8 flex gap-4">
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Quản lý người dùng</button>
        <button className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-50 transition">Xem thống kê</button>
      </div> */}
    </div>
  );
};

export default AdminPage;
