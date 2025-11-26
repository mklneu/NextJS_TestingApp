"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaVial, FaUndoAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatAppointmentDate } from "@/services/OtherServices";
import { getAllTestResults, TestResult } from "@/services/TestResultServices";
import { translateTestType } from "@/utils/translateEnums";
import { Pagination } from "@/services/OtherServices";
import { testTypeOptions } from "@/utils/map";
import { useDebounce } from "@/hooks/useDebounce";

// Component Badge cho loại xét nghiệm
const TestTypeBadge = ({ testType }: { testType: string }) => {
  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
      {translateTestType(testType)}
    </span>
  );
};

const AdminTestResultsPage = () => {
  const router = useRouter();

  const [allTestResults, setAllTestResults] = useState<TestResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);

  const [testTypeFilter, setTestTypeFilter] = useState<string>("ALL");

  // State cho việc phân trang
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); // Bắt đầu từ trang 1
  const pageSize = 5; // Số mục trên mỗi trang
  const [sortOrder, setSortOrder] = useState<string>("testTime,desc");

  // Fetch all test results once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          sort: sortOrder,
          search: debouncedSearch,
          testType: testTypeFilter,
        };
        // Gọi API với tham số
        const responseData = await getAllTestResults(params);

        setAllTestResults(responseData.data); // Cập nhật danh sách kết quả
        setTotalPages(responseData.meta.pages);
        setTotal(responseData.meta.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, sortOrder, debouncedSearch, testTypeFilter]); // Chạy lại khi trang hoặc sắp xếp thay đổi

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, testTypeFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTestTypeFilter("ALL");
    setCurrentPage(1); // Quay về trang 1
    setSortOrder("testTime,desc"); // Reset cả sắp xếp (tùy chọn)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Kết quả Xét nghiệm</h1>
              <p className="mt-2 text-purple-100">
                Tra cứu và quản lý tất cả kết quả xét nghiệm trong hệ thống
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">
                  <FaVial />
                </div>
                <div>
                  <p className="text-xs text-purple-100">Tổng số kết quả</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter/Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative lg:col-span-1 lg:col-start-1 w-fit">
              <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                type="text"
                placeholder="Tìm bệnh nhân, bác sĩ"
                className="w-full pl-10 p-2.5 border text-gray-700 focus:border-blue-500 border-gray-300 rounded-lg bg-gray-50 outline-none text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative lg:col-start-3">
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
            <div className="relative lg:col-start-4">
              <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <select
                value={testTypeFilter}
                className="w-full pl-10 p-2.5 border text-gray-700 border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 outline-none appearance-none text-sm"
                onChange={(e) => setTestTypeFilter(e.target.value)}
              >
                <option value="ALL">Tất cả loại xét nghiệm</option>
                {testTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách kết quả...</p>
          </div>
        ) : allTestResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500 mb-4">
              Không có kết quả nào khớp với điều kiện tìm kiếm của bạn.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setTestTypeFilter("ALL");
                // setDateRange({ start: "", end: "" });
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
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
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "testTime,desc"
                            ? "testTime,asc"
                            : "testTime,desc"
                        )
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        Ngày xét nghiệm
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại xét nghiệm
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTestResults.map((result) => (
                    <tr
                      key={result.id}
                      className="hover:bg-purple-50 text-center
                      transition-colors duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                        {formatAppointmentDate(result.testTime)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {result.patient.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                        {result.doctor.fullName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <TestTypeBadge testType={result.testType} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            if (result.appointment.id) {
                              router.push(
                                `/profile/appointments/${result.appointment.id}/testResults/${result.id}`
                              );
                            }
                          }}
                          className="text-purple-600 duration-300 cursor-pointer
                          hover:text-purple-800 p-2 rounded-full hover:bg-gray-200"
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

export default AdminTestResultsPage;
