"use client";

import { useState, useEffect } from "react";
import {
  getAllAppointments,
  AppointmentStatus,
} from "@/services/AppointmentServices";
import { FaSearch, FaFilter, FaEye, FaUndoAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatAppointmentDate } from "@/services/OtherServices";
import { Appointment } from "@/types/frontend";
import { Pagination } from "@/services/OtherServices"; // Giả sử bạn có component này từ trang bác sĩ
import {
  translateAppointmentStatus,
  translateAppointmentType,
} from "@/utils/translateEnums";
import { appointmentStatusOptions, appointmentTypeOptions } from "@/utils/map";

// Component Badge cho trạng thái
const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const statusStyles: { [key in AppointmentStatus]: string } = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 inline-flex text-sm 
        leading-5 font-semibold rounded-md ${statusStyles[status]}`}
    >
      {translateAppointmentStatus(status)}
    </span>
  );
};

const AdminAppointmentsPage = () => {
  const router = useRouter();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("ALL");

  // Pagination State
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("appointmentDate,desc");

  const pageSize = 6; // Số lượng item mỗi trang

  // Fetch all appointments once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          sort: sortOrder,
          search: searchTerm,
          status: statusFilter,
          appointmentType: appointmentTypeFilter,
        };
        // Gọi API với tham số
        const responseData = await getAllAppointments(params);

        setAllAppointments(responseData.data); // Cập nhật danh sách kết quả
        setTotalPages(responseData.meta.pages);
        setTotal(responseData.meta.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    pageSize,
    sortOrder,
    searchTerm,
    statusFilter,
    appointmentTypeFilter,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setAppointmentTypeFilter("ALL");
    setCurrentPage(1);
    setSortOrder("appointmentDate,desc");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản lý lịch hẹn</h1>
              <p className="mt-2 text-blue-100">
                Theo dõi, lọc và quản lý tất cả lịch hẹn trong hệ thống
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">🗓️</div>
                <div>
                  <p className="text-xs text-blue-100">Tổng số lịch hẹn</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter/Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-row items-center gap-4">
            {/* Phần tử bên trái */}
            <div className="relative w-fit">
              <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                type="text"
                placeholder="Tìm bệnh nhân, bác sĩ"
                className="w-full pl-10 p-2.5 border text-gray-700 focus:border-blue-500 border-gray-300 rounded-lg bg-gray-50 outline-none text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Nhóm các phần tử bên phải */}
            <div className="flex flex-row items-center gap-4 ml-auto">
              <div className="relative lg:justify-end w-fit">
                <button
                  onClick={handleResetFilters}
                  className="w-full h-full px-4 cursor-pointer
                  py-2.5 border text-gray-700 duration-300
                  hover:bg-gray-100 border-gray-300 
                  rounded-lg bg-gray-50 outline-none 
                  text-sm flex items-center justify-center gap-2"
                  title="Xóa bộ lọc"
                >
                  <FaUndoAlt className="text-gray-500" />
                  Xóa bộ lọc
                </button>
              </div>
              <div className="relative lg:justify-end w-60">
                <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={appointmentTypeFilter}
                  className="w-full pl-10 p-2.5 border text-gray-700 border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 outline-none appearance-none text-sm"
                  onChange={(e) => setAppointmentTypeFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả loại lịch hẹn</option>
                  {appointmentTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative justify-end w-50">
                <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  className="w-full pl-10 p-2.5 border text-gray-700 border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 outline-none appearance-none text-sm"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  {appointmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách lịch hẹn...</p>
          </div>
        ) : allAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy lịch hẹn
            </h3>
            <p className="text-gray-500 mb-4">
              Không có lịch hẹn nào khớp với điều kiện tìm kiếm của bạn.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                // setDateRange({ start: "", end: "" });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "appointmentDate,desc"
                            ? "appointmentDate,asc"
                            : "appointmentDate,desc"
                        )
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        Ngày hẹn
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại hẹn
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-blue-50 text-center 
                       duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                        {formatAppointmentDate(apt.appointmentDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {apt.patient?.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {apt.doctor?.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {translateAppointmentType(apt.appointmentType)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={apt.status} />
                        {/* {apt.status} */}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="relative group inline-block">
                          <button
                            onClick={() => {
                              router.push(`/profile/appointments/${apt.id}`);
                            }}
                            className="text-purple-600 duration-300 cursor-pointer
                            hover:text-purple-800 p-2 rounded-full hover:bg-gray-200"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
