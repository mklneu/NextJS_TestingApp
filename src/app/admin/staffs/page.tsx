"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import AddNewUserModal from "@/components/Users/AddUser.Modal";
import UpdateUserModal from "@/components/Users/UpdateUser.Modal";
import { AxiosError } from "axios";
import { getAllHospitals } from "@/services/HospitalServices";
import { formatDateToDMY, Pagination } from "@/services/OtherServices";
import { deletePatientById, getAllPatients } from "@/services/PatientServices";
import Button from "@/components/Button";
import { ErrorResponse, Hospital, resUser } from "@/types/frontend";
import { roleOptions } from "@/services/RoleServices";
import { translateRole } from "@/utils/translateEnums";

export default function StaffsPage() {
  const [users, setUsers] = useState<resUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // State để lưu tổng số trang từ API
  const usersPerPage = 8;

  // Fetch users với các tham số
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: usersPerPage,
        searchTerm,
        filterGender,
        role: "STAFF",
      };
      const response = await getAllPatients(params);
      setUsers(response.data || []); // Dữ liệu người dùng
      setTotalPages(response.meta?.pages || 1); // Dữ liệu phân trang
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error("Lỗi khi tải dữ liệu nhân viên");
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  //fetch hospitals
  const fetchHospitals = async () => {
    try {
      const data = await getAllHospitals();
      setHospitals(data);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error("Error fetching hospitals:", err.message);
      toast.error("Lỗi khi tải dữ liệu bệnh viện");
    }
  };

  // useEffect chính để fetch lại dữ liệu khi có thay đổi
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: usersPerPage,
          searchTerm,
          filterGender,
          role: "STAFF",
        };
        const response = await getAllPatients(params);
        setUsers(response.data || []); // Dữ liệu người dùng
        setTotalPages(response.meta?.pages || 1); // Dữ liệu phân trang
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        toast.error("Lỗi khi tải dữ liệu nhân viên");
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, searchTerm, filterGender]); // Phụ thuộc vào các state filter

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handlers for user actions
  const handleDelete = async (userId: number) => {
    try {
      await deletePatientById(userId, fetchUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = (userId: number) => {
    setSelectedUserId(userId);
    setShowUpdateModal(true);
  };

  // Reset về trang 1 khi tìm kiếm hoặc lọc
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGender(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="container mx-auto">
        {/* Header with stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
              <p className="mt-2 text-blue-100">
                Quản lý thông tin và quyền truy cập của nhân viên trong hệ thống
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <div className="mr-3 text-3xl">👥</div>
                <div>
                  <p className="text-xs text-blue-100">Tổng số nhân viên</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 
              left-0 flex items-center pl-3.5 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border outline-none
                border-gray-300 text-gray-900 text-sm
                 rounded-lg focus:ring-blue-500 
                 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Tìm kiếm nhân viên"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Filter dropdown */}
              <div className="relative">
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <select
                    className="bg-gray-50 border outline-none w-40
                    border-gray-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterGender}
                    onChange={handleFilterChange}
                  >
                    <option value="ALL">Tất cả giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>

              {/* Add user button */}
              <Button onClick={() => setShowAddModal(true)} className="!h-11">
                <FaPlus /> Thêm nhân viên
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu nhân viên...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy nhân viên
            </h3>
            <p className="text-gray-500 mb-4">
              Không có nhân viên nào khớp với điều kiện tìm kiếm của bạn
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterGender("ALL");
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
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên đăng nhập
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ tên
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày sinh
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh viện
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="w-1/10 px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Dùng trực tiếp state 'users' */}
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div
                          className="w-fit bg-blue-100 mx-auto
                        text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {user.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center mx-auto">
                          <div
                            className="flex-shrink-0 h-10 w-10
                          bg-blue-100 text-blue-600 rounded-full flex 
                          items-center justify-center font-bold"
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {user.fullName}
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {user.email}
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {user.dob ? formatDateToDMY(user.dob) : "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap"
                      >
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.gender === "MALE"
                              ? "bg-blue-100 text-blue-800"
                              : user.gender === "FEMALE"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {user.gender === "MALE"
                            ? "Nam"
                            : user.gender === "FEMALE"
                            ? "Nữ"
                            : "Khác"}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {user.address}
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {user.company?.name || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 text-center
                      whitespace-nowrap text-sm text-gray-500"
                      >
                        {(user.role?.name &&
                          translateRole(user.role.name.toUpperCase())) ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3 justify-center">
                          {/* <button
                            onClick={() => handleView(user.id)}
                            className="text-blue-600 cursor-pointer
                            hover:text-blue-900 bg-blue-100 
                            hover:bg-blue-200 p-1.5 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button> */}
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="text-green-700 cursor-pointer
                            hover:text-green-900 bg-green-200 
                            hover:bg-green-300 p-1.5 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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

      {/* Add User Modal */}
      <AddNewUserModal
        show={showAddModal}
        setShow={setShowAddModal}
        onSubmit={fetchUsers}
        role={"nhân viên"}
      />

      {/* Update User Modal */}
      {selectedUserId && (
        <UpdateUserModal
          show={showUpdateModal}
          setShow={setShowUpdateModal}
          userId={selectedUserId}
          setUserId={setSelectedUserId}
          onUpdate={fetchUsers}
          roleOptions={roleOptions}
          companyOptions={hospitals.map((h) => ({
            label: h.name,
            value: String(h.id),
          }))}
        />
      )}

      {/* View User Modal */}
      {/* {selectedUserId && (
        <ViewUserModal
          show={showViewModal}
          setShow={setShowViewModal}
          userId={selectedUserId}
          setUserId={setSelectedUserId}
        />
      )} */}
    </div>
  );
}
