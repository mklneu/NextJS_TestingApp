"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUndoAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import AddDoctorModal from "@/components/Doctors/AddDoctor.Modal";
import UpdateDoctorModal from "@/components/Doctors/UpdateDoctor.Modal";
import ViewDoctorModal from "@/components/Doctors/ViewDoctor.Modal";
import { translateGender, translateSpecialty } from "@/utils/translateEnums";
import {
  deleteDoctor,
  DoctorProfile,
  getAllDoctors,
} from "@/services/DoctorServices";
import { Pagination } from "@/services/OtherServices";
import Button from "@/components/Button";
import { specialtyOptions } from "@/utils/map";
import { useDebounce } from "@/hooks/useDebounce";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 800);

  const [filterSpecialization, setFilterSpecialization] =
    useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [sortOrder, setSortOrder] = useState("fullName,asc");
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  // Fetch doctors from backend with filters and pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          sort: "",
          search: debouncedSearch,
          filterSpecialization: filterSpecialization,
          filterStatus: filterStatus,
        };
        // Gọi API với tham số
        const responseData = await getAllDoctors(params);

        setDoctors(responseData.data); // Cập nhật danh sách kết quả
        setTotalPages(responseData.meta.pages);
        setTotal(responseData.meta.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, debouncedSearch, filterSpecialization, filterStatus]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: "",
        search: debouncedSearch,
        filterSpecialization: filterSpecialization,
        filterStatus: filterStatus,
      };
      // Gọi API với tham số
      const responseData = await getAllDoctors(params);

      setDoctors(responseData.data); // Cập nhật danh sách kết quả
      setTotalPages(responseData.meta.pages);
      setTotal(responseData.meta.total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterSpecialization, filterStatus]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handlers for doctor actions
  const handleDelete = async (doctorId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) {
      try {
        // 1. Gọi API xóa (đợi cho xong)
        await deleteDoctor(doctorId);

        // 2. Cập nhật UI ngay lập tức (xóa khỏi danh sách hiện tại)
        setDoctors((prev) =>
          prev.filter((doctor) => doctor.profileId !== doctorId)
        );
        // toast.success("Đã xóa bác sĩ thành công");

        // 3. Tải lại dữ liệu để cập nhật phân trang/tổng số
        fetchDoctors();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        toast.error("Không thể xóa bác sĩ. Vui lòng thử lại sau.");
      }
    }
  };

  const handleUpdate = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    setShowUpdateModal(true);
  };

  const handleView = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    setShowViewModal(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterSpecialization("ALL");
    setFilterStatus("ALL");
    // setTestTypeFilter("ALL");
    setCurrentPage(1); // Quay về trang 1
    // setSortOrder("prescriptionDate,desc"); // Reset cả sắp xếp (tùy chọn)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="container mx-auto">
        {/* Header with stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản lý bác sĩ</h1>
              <p className="mt-2 text-blue-100">
                Quản lý thông tin và trạng thái của đội ngũ y bác sĩ
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">👨‍⚕️</div>
                <div>
                  <p className="text-xs text-blue-100">Tổng số bác sĩ</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search bar */}
            <div className="relative lg:col-span-1 lg:col-start-1 w-fit">
              <FaSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                type="text"
                placeholder="Tìm kiếm bác sĩ"
                className="w-full pl-10 p-2.5 border text-gray-700 focus:border-blue-500 border-gray-300 rounded-lg bg-gray-50 outline-none text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 ">
              <div className="relative lg:justify-end w-fit">
                <button
                  onClick={handleResetFilters}
                  className="w-full h-full px-4 cursor-pointer
                  py-2.5 border text-gray-700 duration-300
                  hover:bg-gray-100 border-gray-300 active:bg-gray-200
                  rounded-lg bg-gray-50 outline-none 
                  text-sm flex items-center justify-center gap-2"
                  title="Xóa bộ lọc"
                >
                  <FaUndoAlt className="text-gray-500" />
                  Xóa bộ lọc
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {/* Filter by specialization */}
                <div className="relative">
                  <div className="flex items-center w-50">
                    <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-10 p-2.5 
                    border text-gray-700 border-gray-300 
                    rounded-lg bg-gray-50 focus:border-blue-500 
                    outline-none appearance-none text-sm"
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                    >
                      <option value="ALL">Tất cả chuyên khoa</option>
                      {specialtyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter by status */}
                {/* <div className="relative">
                  <div className="flex items-center w-45">
                    <FaFilter className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-10 p-2.5 
                    border text-gray-700 border-gray-300 
                    rounded-lg bg-gray-50 focus:border-blue-500 
                    outline-none appearance-none text-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="ACTIVE">Đang hoạt động</option>
                      <option value="INACTIVE">Tạm ngưng</option>
                    </select>
                  </div>
                </div> */}
              </div>

              {/* Add doctor button */}
              <Button
                onClick={() => setShowAddModal(true)}
                icon={<FaPlus />}
                className="!h-11"
              >
                Thêm bác sĩ
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách bác sĩ...</p>
          </div>
        ) : doctors?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy bác sĩ
            </h3>
            <p className="text-gray-500 mb-4">
              Không có bác sĩ nào khớp với điều kiện tìm kiếm của bạn
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterSpecialization("ALL");
                setFilterStatus("ALL");
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh viện
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chuyên khoa
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kinh nghiệm
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>

                    {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th> */}
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor.profileId}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                              doctor.gender === "MALE"
                                ? "bg-blue-600"
                                : "bg-pink-600"
                            }`}
                          >
                            {doctor.fullName.split(" ").pop()?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {doctor.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {doctor.profileId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-center
                       text-sm text-gray-500"
                      >
                        {doctor.hospital.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div
                          className="px-2 w-fit flex text-xs mx-auto 
                        leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {translateSpecialty(doctor.specialty.specialtyName)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {doctor.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.phoneNumber}
                        </div>
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-center
                       text-sm text-gray-500"
                      >
                        {doctor.experienceYears} năm
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-center
                       text-sm text-gray-500"
                      >
                        {translateGender(doctor.gender)}
                      </td>
                      {/* <td className="px-4 py-4 whitespace-nowrap">
                        <div
                          className={`px-2 flex mx-auto w-fit
                            text-xs leading-5 font-semibold rounded-full ${
                              doctor.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {doctor.status === "ACTIVE"
                            ? "Đang hoạt động"
                            : "Tạm ngưng"}
                        </div>
                      </td> */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3 justify-center">
                          <button
                            onClick={() => handleView(doctor.profileId)}
                            className="text-blue-600 cursor-pointer
                            hover:text-blue-900 bg-blue-100 
                            hover:bg-blue-200 p-1.5 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleUpdate(doctor.profileId)}
                            className="text-green-700 cursor-pointer
                            hover:text-green-900 bg-green-200 
                            hover:bg-green-300 p-1.5 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.profileId)}
                            className="text-red-600 cursor-pointer
                            hover:text-red-900 bg-red-100 
                            hover:bg-red-200 p-1.5 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

      {/* Modals */}
      <AddDoctorModal
        show={showAddModal}
        setShow={setShowAddModal}
        onSubmit={fetchDoctors}
      />

      {selectedDoctorId && (
        <UpdateDoctorModal
          show={showUpdateModal}
          setShow={setShowUpdateModal}
          doctorId={selectedDoctorId}
          setDoctorId={setSelectedDoctorId}
          onUpdate={fetchDoctors}
        />
      )}

      {selectedDoctorId && (
        <ViewDoctorModal
          show={showViewModal}
          setShow={setShowViewModal}
          doctorId={selectedDoctorId}
          setDoctorId={setSelectedDoctorId}
        />
      )}
    </div>
  );
}
