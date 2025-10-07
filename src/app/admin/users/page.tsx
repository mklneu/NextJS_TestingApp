"use client";
import { useState, useEffect } from "react";
import {
  getAllUsers,
  deleteUserById,
} from "@/services/UserServices";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { toast } from "react-toastify";
import AddNewUserModal from "@/components/Users/AddUser.Modal";
import UpdateUserModal from "@/components/Users/UpdateUser.Modal";
// import ViewUserModal from "@/components/Users/ViewUser.Modal";
import { AxiosError } from "axios";
import { getAllHospitals } from "@/services/HospitalServices";
import { formatDateToDMY } from "@/services/OtherServices";

export default function UsersPage() {
  const [users, setUsers] = useState<resUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<resUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  // const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const genders = ["Nam", "Nữ", "Khác"];

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error("Lỗi khi tải dữ liệu bệnh nhân");
      console.error("Error fetching users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  //fetch hospitals
  const fetchHospitals = async () => {
    // setLoadingHospitals(true);
    try {
      const data = await getAllHospitals();
      setHospitals(data);
      console.log("Hospitals data:", data);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error("Lỗi khi tải dữ liệu bệnh viện");
      console.error("Error fetching hospitals:", err.message);
    }
    // finally {
    //   setLoadingHospitals(false);
    // }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Apply filters when search term or gender filter changes
  useEffect(() => {
    const results = users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        filterGender === "ALL" || user.gender === filterGender;

      return matchesSearch && matchesGender;
    });

    setFilteredUsers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterGender, users]);

  // Calculate current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handlers for user actions
  const handleDelete = async (userId: number) => {
    try {
      await deleteUserById(userId, fetchUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = (userId: number) => {
    setSelectedUserId(userId);
    setShowUpdateModal(true);
  };

  // const handleView = (userId: number) => {
  //   setSelectedUserId(userId);
  //   setShowViewModal(true);
  // };

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
              <h1 className="text-3xl font-bold">Quản lý bệnh nhân</h1>
              <p className="mt-2 text-blue-100">
                Quản lý thông tin và quyền truy cập của bệnh nhân trong hệ thống
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <HiOutlineUserGroup className="text-3xl mr-3" />
                <div>
                  <p className="text-xs text-blue-100">Tổng số bệnh nhân</p>
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border outline-none
                border-gray-300 text-gray-900 text-sm
                 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Filter dropdown */}
              <div className="relative">
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <select
                    className="bg-gray-50 border outline-none w-25
                    border-gray-300 text-gray-900 text-sm 
                    rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="ALL">Tất cả</option>
                    {genders.map((gender, index) => (
                      <option key={index} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add user button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <FaPlus /> Thêm bệnh nhân
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-20 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu bệnh nhân...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-20 text-center">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy bệnh nhân
            </h3>
            <p className="text-gray-500 mb-4">
              Không có bệnh nhân nào khớp với điều kiện tìm kiếm của bạn
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
                  {currentUsers.map((user) => (
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
                        {user.role?.name || "N/A"}
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
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  trong{" "}
                  <span className="font-medium">{filteredUsers.length}</span>{" "}
                  bệnh nhân
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

      {/* Add User Modal */}
      <AddNewUserModal
        show={showAddModal}
        setShow={setShowAddModal}
        onSubmit={fetchUsers}
      />

      {/* Update User Modal */}
      {selectedUserId && (
        <UpdateUserModal
          show={showUpdateModal}
          setShow={setShowUpdateModal}
          userId={selectedUserId}
          setUserId={setSelectedUserId}
          onUpdate={fetchUsers}
          roleOptions={[
            { label: "Admin", value: "1" },
            { label: "Doctor", value: "2" },
            { label: "User", value: "3" },
          ]}
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
