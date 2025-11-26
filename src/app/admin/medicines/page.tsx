"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPills,
  FaSearch,
  FaUndoAlt,
} from "react-icons/fa";
import Button from "@/components/Button";
import AddEditMedicineModal from "@/components/Medicines/AddEditMedicine.Modal";
import { formatAppointmentDate, Pagination } from "@/services/OtherServices";
import { useDebounce } from "@/hooks/useDebounce";
import {
  deleteMedicine,
  getAllMedicines,
  Medicine,
} from "@/services/MedicineServices";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          sort: "name,asc",
          search: debouncedSearch,
        };
        // Gọi API getAllMedicines
        const res = await getAllMedicines(params);

        // Cập nhật state từ response
        setMedicines(res.data || []);
        setTotal(res.meta?.total || 0);
        setTotalPages(res.meta?.pages || 1);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách thuốc");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [currentPage, debouncedSearch]);

  // Hàm lấy dữ liệu
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: "name,asc",
        search: debouncedSearch,
      };
      // Gọi API getAllMedicines
      const res = await getAllMedicines(params);
      // Cập nhật state từ response
      setMedicines(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.pages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách thuốc");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setSelectedMedicine(null);
    setShowModal(true);
  };

  // Mở modal sửa
  const handleEdit = (med: Medicine) => {
    setSelectedMedicine(med);
    setShowModal(true);
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thuốc này?")) {
      try {
        await deleteMedicine(id);
        toast.success("Xóa thuốc thành công");
        // Nếu trang hiện tại chỉ có 1 item và không phải trang 1, lùi về trang trước
        if (medicines.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchMedicines();
        }
      } catch (error) {
        toast.error("Lỗi khi xóa thuốc");
        console.error(error);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    // setTestTypeFilter("ALL");
    setCurrentPage(1); // Quay về trang 1
    // setSortOrder("prescriptionDate,desc"); // Reset cả sắp xếp (tùy chọn)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Danh sách thuốc</h1>
            <p className="mt-2 text-green-100">
              Quản lý tất cả các loại thuốc trong hệ thống
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="mr-3 text-3xl">
                <FaPills />
              </div>
              <div>
                <p className="text-xs text-green-100">Tổng số loại thuốc</p>
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
              value={searchTerm}
              placeholder="Tìm kiếm tên thuốc, hoạt chất"
              className="w-80 pl-10 p-2.5 border text-gray-700
                       focus:border-green-500 border-gray-300 rounded-lg
                        bg-gray-50 outline-none text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex relative justify-end gap-3">
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
            <Button
              onClick={handleAdd}
              icon={<FaPlus size={18} />}
              className="w-50"
              variant="green"
            >
              Thêm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="w-2/6 p-4">Tên thuốc</th>
                <th className="w-1/6 p-4">Hoạt chất</th>
                <th className="w-1/6 p-4 text-center">Đơn vị</th>
                <th className="w-1/6 p-4 text-center">Giá cơ bản</th>
                <th className="w-1/6 p-4 text-center">Hạn sử dụng</th>
                <th className="w-1/6 p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex justify-center items-center gap-3 text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500 italic"
                  >
                    Không tìm thấy thuốc nào phù hợp.
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr
                    key={med.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {med.name}
                      </div>
                      {med.description && (
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">
                          {med.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {med.activeIngredient || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold border border-gray-200">
                        {med.baseUnit}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-blue-600">
                      {med.basePrice.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 text-center text-sm text-gray-600">
                      {med.expiryDate
                        ? formatAppointmentDate(med.expiryDate)
                        : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(med)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg duration-300 cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg duration-300 cursor-pointer"
                          title="Xóa"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Modal Component */}
      <AddEditMedicineModal
        show={showModal}
        setShow={setShowModal}
        onSuccess={fetchMedicines}
        dataEdit={selectedMedicine}
      />
    </div>
  );
}
