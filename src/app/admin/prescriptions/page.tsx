"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaFileMedical, FaUndoAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatAppointmentDate } from "@/services/OtherServices";
import {
  getAllPrescriptions,
  Prescription,
} from "@/services/PrescriptionServices";
import { Pagination } from "@/services/OtherServices";

const AdminPrescriptionsPage = () => {
  const router = useRouter();
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState("prescriptionDate,desc");
  const pageSize = 4;

  // Fetch all prescriptions once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          sort: sortOrder,
          search: searchTerm,
          diagnosis: "",
        };
        // Gọi API với tham số
        const responseData = await getAllPrescriptions(params);

        setAllPrescriptions(responseData.data); // Cập nhật danh sách kết quả
        setTotalPages(responseData.meta.pages);
        setTotal(responseData.meta.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, sortOrder]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm("");
    // setTestTypeFilter("ALL");
    setCurrentPage(1); // Quay về trang 1
    setSortOrder("prescriptionDate,desc"); // Reset cả sắp xếp (tùy chọn)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Đơn thuốc</h1>
              <p className="mt-2 text-green-100">
                Tra cứu và quản lý tất cả đơn thuốc đã được kê trong hệ thống
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">
                  <FaFileMedical />
                </div>
                <div>
                  <p className="text-xs text-green-100">Tổng số đơn thuốc</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter/Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md flex flex-col md:flex-row">
          <div className="flex lg:flex-row flex-col justify-between w-full gap-4 md:gap-0">
            <div className="relative md:col-span-1">
              <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân, bác sĩ"
                className="w-full pl-10 p-2.5 border text-gray-700
                 focus:border-green-500 border-gray-300 rounded-lg
                  bg-gray-50 outline-none text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative justify-end">
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
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách đơn thuốc...</p>
          </div>
        ) : allPrescriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy đơn thuốc
            </h3>
            <p className="text-gray-500 mb-4">
              Không có đơn thuốc nào khớp với điều kiện tìm kiếm của bạn.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                // setDateRange({ start: "", end: "" });
              }}
              className="text-green-600 hover:text-green-800 font-medium"
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
                      className="px-4 py-3 text-center text-xs 
                      font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "prescriptionDate,desc"
                            ? "prescriptionDate,asc"
                            : "prescriptionDate,desc"
                        )
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        Ngày kê đơn
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allPrescriptions.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-green-50 text-center
                       transition-colors duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                        {formatAppointmentDate(p.prescriptionDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {p.patient.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {p.doctor.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() =>
                            router.push(
                              `/profile/appointments/${p.appointment.id}/prescriptions/${p.id}`
                            )
                          }
                          className="text-green-600 duration-300 cursor-pointer
                          hover:text-green-800 p-2 rounded-full hover:bg-gray-200"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
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

export default AdminPrescriptionsPage;
