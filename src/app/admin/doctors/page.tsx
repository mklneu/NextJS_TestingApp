"use client";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import AddDoctorModal from "@/components/Doctors/AddDoctor.Modal";
import UpdateDoctorModal from "@/components/Doctors/UpdateDoctor.Modal";
import ViewDoctorModal from "@/components/Doctors/ViewDoctor.Modal";
import {
  translateSpecialty,
  translateGender,
  translateStatus,
} from "@/utils/translateEnums";
import {
  Doctor,
  getAllDoctors,
  deleteDoctorById,
} from "@/services/DoctorServices";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  const doctorsPerPage = 8;

  // Danh sách chuyên khoa mẫu
  const specializations = [
    "CARDIOLOGY",
    "DERMATOLOGY",
    "ENDOCRINOLOGY",
    "GASTROENTEROLOGY",
    "GENERAL_PRACTICE",
    "HEMATOLOGY",
    "NEUROLOGY",
    "OBSTETRICS_GYNECOLOGY",
    "ONCOLOGY",
    "OPHTHALMOLOGY",
    "ORTHOPEDICS",
    "OTOLARYNGOLOGY",
    "PEDIATRICS",
    "PSYCHIATRY",
    "PULMONOLOGY",
    "RADIOLOGY",
    "UROLOGY",
  ];

  // Tạo dữ liệu mẫu và cung cấp một hàm để làm mới dữ liệu
  //   const fetchDoctors = () => {
  //     setLoading(true);

  //     // Trong ứng dụng thực, bạn sẽ sử dụng getAllDoctors() từ DoctorServices
  //     // Hiện tại dùng dữ liệu mẫu để demo
  //     setTimeout(() => {
  //       const mockDoctors: Doctor[] = Array.from({ length: 20 }, (_, i) => ({
  //         id: i + 1,
  //         name: `BS. ${
  //           ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng"][
  //             Math.floor(Math.random() * 5)
  //           ]
  //         } ${
  //           ["Văn", "Thị", "Hải", "Quang", "Minh"][Math.floor(Math.random() * 5)]
  //         } ${
  //           ["A", "B", "C", "D", "E", "F", "G", "H"][
  //             Math.floor(Math.random() * 8)
  //           ]
  //         }`,
  //         specialization:
  //           specializations[Math.floor(Math.random() * specializations.length)],
  //         email: `doctor${i + 1}@smarthealth.com`,
  //         phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
  //         experience: Math.floor(1 + Math.random() * 20),
  //         gender: Math.random() > 0.4 ? "MALE" : "FEMALE",
  //         status: Math.random() > 0.2 ? "ACTIVE" : "INACTIVE",
  //       }));

  //       setDoctors(mockDoctors);
  //       setFilteredDoctors(mockDoctors);
  //       setLoading(false);
  //     }, 800);
  //   };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getAllDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchDoctors khi component được mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Apply filters when search term or specialization filter changes
  useEffect(() => {
    const results = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phoneNumber.includes(searchTerm);

      const matchesSpecialization =
        filterSpecialization === "ALL" ||
        doctor.specialty === filterSpecialization;

      const matchesStatus =
        filterStatus === "ALL" || doctor.status === filterStatus;

      return matchesSearch && matchesSpecialization && matchesStatus;
    });

    setFilteredDoctors(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterSpecialization, filterStatus, doctors]);

  // Calculate current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Handlers for doctor actions
  const handleDelete = (doctorId: number) => {
    // Trong ứng dụng thực, bạn sẽ gọi deleteDoctorById từ DoctorServices
    // Hiện tại mô phỏng xóa bác sĩ trực tiếp trên state
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) {
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId));
      toast.success("Đã xóa bác sĩ thành công");
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

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={`px-3 py-1 rounded ${
          currentPage === i
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
                  <p className="text-2xl font-bold">{doctors.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 outline-none
                text-gray-900 text-sm rounded-lg focus:ring-blue-500
                 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Tìm kiếm bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Filter by specialization */}
              <div className="relative">
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <select
                    className="bg-gray-50 border outline-none
                    border-gray-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                  >
                    <option value="ALL">Tất cả chuyên khoa</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>
                        {translateSpecialty(spec)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter by status */}
              <div className="relative">
                <div className="flex items-center">
                  <select
                    className="bg-gray-50 border outline-none
                    border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="INACTIVE">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              {/* Add doctor button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <FaPlus /> Thêm bác sĩ
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách bác sĩ...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
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
                      Chuyên khoa
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kinh nghiệm
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
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
                              ID: {doctor.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div
                          className="px-2 w-fit flex text-xs mx-auto 
                        leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {translateSpecialty(doctor.specialty)}
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
                      <td className="px-4 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3 justify-center">
                          <button
                            onClick={() => handleView(doctor.id)}
                            className="text-blue-600 cursor-pointer
                            hover:text-blue-900 bg-blue-100 
                            hover:bg-blue-200 p-1.5 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleUpdate(doctor.id)}
                            className="text-green-700 cursor-pointer
                            hover:text-green-900 bg-green-200 
                            hover:bg-green-300 p-1.5 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.id)}
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
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstDoctor + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastDoctor, filteredDoctors.length)}
                  </span>{" "}
                  trong{" "}
                  <span className="font-medium">{filteredDoctors.length}</span>{" "}
                  bác sĩ
                </div>
                <nav className="flex space-x-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Trước
                  </button>
                  {paginationItems}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Sau
                  </button>
                </nav>
              </div>
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
