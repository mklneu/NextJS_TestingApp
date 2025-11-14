"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaFilter, FaFlask, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatAppointmentDate, Pagination } from "@/services/OtherServices";
import { TestResultStatus } from "@/types/frontend";
import {
  getAllTestResults,
  TestResult,
  updateTestResult,
} from "@/services/TestResultServices";
import {
  translateTestResultStatus,
  translateTestType,
} from "@/utils/translateEnums";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext"; // 1. Import useAuth

// Component Badge cho trạng thái
const StatusBadge = ({ status }: { status: TestResultStatus }) => {
  const statusStyles: { [key in TestResultStatus]: string } = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    PRELIMINARY: "bg-purple-100 text-purple-800",
    REVIEWED: "bg-teal-100 text-teal-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}
    >
      {translateTestResultStatus(status)}
    </span>
  );
};

const LabDashboardPage = () => {
  const { staffProfile } = useAuth(); // 2. Lấy user từ context
  const router = useRouter();
  const [allTestResults, setAllTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestResultStatus | "ALL">(
    "ALL"
  );
  const [sortOrder, setSortOrder] = useState<string>("testTime,desc");

  // const [staff, setStaff] = useState<StaffProfile | null>(null); // Sửa: Khởi tạo là null

  // Pagination State
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 7;

  // 3. Thêm useEffect để set staff khi có thông tin user
  // useEffect(() => {
  //   if (user && userRole === "staff") {
  //     setStaff(user as StaffProfile);
  //   }
  // }, [user, userRole]);

  // Fetch all test results
  useEffect(() => {
    // Thêm điều kiện: chỉ fetch khi đã có thông tin staff
    if (!staffProfile) return;

    const fetchTestResults = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: itemsPerPage,
          sort: sortOrder,
          search: searchTerm,
          testType: "",
          hospitalId: staffProfile.hospital?.id, // Bây giờ sẽ có giá trị
          status: statusFilter === "ALL" ? undefined : statusFilter,
        };
        const res = await getAllTestResults(params);
        setAllTestResults(res.data || []);
        setTotalPages(res.meta?.pages || 0);
        setTotal(res.meta?.total || 0);
      } catch (error) {
        console.error("Failed to fetch test results:", error);
        toast.error("Không thể tải danh sách yêu cầu xét nghiệm.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestResults();
  }, [currentPage, sortOrder, statusFilter, searchTerm, staffProfile]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleStartProcessing = async (result: TestResult) => {
    // Nếu trạng thái không phải là "Yêu cầu", chỉ cần điều hướng
    if (result.status !== "REQUESTED") {
      router.push(
        `/profile/appointments/${result.appointment.id}/testResults/${result.id}`
      );
      return;
    }

    // Nếu là "Yêu cầu", cập nhật trạng thái thành "Đang tiến hành" trước
    try {
      const payload = { ...result, status: "IN_PROGRESS" as TestResultStatus };
      await updateTestResult(result.id, payload);

      // Cập nhật UI ngay lập tức
      setAllTestResults((prev) =>
        prev.map((r) =>
          r.id === result.id ? { ...r, status: "IN_PROGRESS" } : r
        )
      );

      //   toast.info("Đã chuyển trạng thái sang 'Đang tiến hành'");

      // Sau đó điều hướng
      router.push(
        `/profile/appointments/${result.appointment.id}/testResults/${result.id}`
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-6 mb-4 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Bảng điều khiển Lab</h1>
              <p className="mt-2 text-teal-100">
                Quản lý và nhập kết quả cho các chỉ định xét nghiệm
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">
                  <FaFlask />
                </div>
                <div>
                  <p className="text-xs text-teal-100">Xét nghiệm chờ xử lý</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter/Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative lg:col-span-1">
              <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân, bác sĩ"
                className="w-full pl-10 p-2.5 border text-gray-700 focus:border-blue-500 border-gray-300 rounded-lg bg-gray-50 outline-none text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
            <div className="relative lg:col-start-3">
              <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 p-2.5 border text-gray-700 border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 outline-none appearance-none text-sm"
                onChange={(e) =>
                  setStatusFilter(e.target.value as TestResultStatus | "ALL")
                }
                value={statusFilter}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="REQUESTED">Yêu cầu xét nghiệm</option>
                <option value="IN_PROGRESS">Đang tiến hành</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="REVIEWED">Đã xem xét</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách yêu cầu...</p>
          </div>
        ) : allTestResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có yêu cầu xét nghiệm
            </h3>
            <p className="text-gray-500 mb-4">
              Hiện không có yêu cầu nào khớp với điều kiện tìm kiếm của bạn.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="text-teal-600 cursor-pointer duration-300
              hover:text-teal-800 font-medium"
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
                      className="px-4 py-3 text-left text-xs
                      font-medium text-gray-500 uppercase duration-300
                      tracking-wider cursor-pointer hover:text-gray-900"
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "testTime,desc"
                            ? "testTime,asc"
                            : "testTime,desc"
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        Ngày chỉ định
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ chỉ định
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại xét nghiệm
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
                  {allTestResults.map((result) => {
                    const isDone =
                      result.status === "COMPLETED" ||
                      result.status === "REVIEWED";
                    return (
                      <tr
                        key={result.id}
                        className="hover:bg-teal-50 transition-colors duration-200"
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
                        <td className="px-4 py-4 whitespace-nowrap text-center text-gray-700">
                          {translateTestType(result.testType)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <StatusBadge status={result.status} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <Button
                            onClick={() => {
                              if (!isDone) {
                                handleStartProcessing(result);
                                router.push(
                                  `/profile/appointments/${result.appointment.id}/testResults/${result.id}`
                                );
                              }
                            }}
                            className="text-teal-600 hover:text-teal-800 
                          p-2 rounded-full hover:bg-gray-200 flex items-center 
                          gap-2 mx-auto cursor-pointer duration-300"
                            disabled={isDone}
                            translate={!isDone}
                            icon={<FaEdit />}
                            variant="secondary"
                          >
                            {" "}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
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

export default LabDashboardPage;
