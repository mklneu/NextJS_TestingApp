import axiosInstance from "./axiosInstance";
/**
 * Đại diện cho một lựa chọn đóng gói trong chuỗi JSON
 * Ví dụ: { unit: "vỉ", quantity: 10, price: 19500 }
 */
export interface PackagingOption {
  unit: string;
  quantity: number;
  price: number;
}

/**
 * Body để tạo hoặc cập nhật một loại thuốc.
 * `packagingOptions` là một chuỗi JSON của mảng PackagingOption[].
 */
export interface MedicineBody {
  name: string;
  activeIngredient: string;
  baseUnit: string;
  basePrice: number;
  packagingOptions: string;
  expiryDate: string; // Dạng ISO string
  description?: string;
}

/**
 * Dữ liệu trả về hoàn chỉnh cho một loại thuốc (bao gồm cả id).
 */
export interface Medicine extends MedicineBody {
  id: number;
}

export interface PaginatedMedicinesResponse {
  meta: PaginationMeta;
  data: Medicine[];
}

// --- 2. Các hàm gọi API ---

/**
 * Tạo một loại thuốc mới
 * @param body Dữ liệu của thuốc
 * @returns Thuốc vừa được tạo
 */
export const createMedicine = async (body: MedicineBody): Promise<Medicine> => {
  try {
    const response = await axiosInstance.post("/medicines", body);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating medicine:", error);
    throw error;
  }
};

/**
 * Lấy danh sách thuốc, có thể tìm kiếm theo tên
 * @param name Tên thuốc để tìm kiếm (tùy chọn)
 * @returns Mảng các loại thuốc
 */
export const getMedicines = async (
  search?: string
): Promise<PaginatedMedicinesResponse> => {
  try {
    const response = await axiosInstance.get("/medicines", {
      params: search ? { search } : {},
    });
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching medicines:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một loại thuốc bằng ID
 * @param id ID của thuốc
 * @returns Dữ liệu chi tiết của thuốc
 */
export const getMedicineById = async (id: number): Promise<Medicine> => {
  try {
    const response = await axiosInstance.get(`/medicines/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error fetching medicine with id ${id}:`, error);
    throw error;
  }
};

/**
 * Cập nhật một loại thuốc đã có
 * @param id ID của thuốc cần cập nhật
 * @param body Dữ liệu mới của thuốc
 * @returns Thuốc sau khi đã được cập nhật
 */
export const updateMedicine = async (
  id: number,
  body: Partial<MedicineBody>
): Promise<Medicine> => {
  try {
    const response = await axiosInstance.put(`/medicines/${id}`, body);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error updating medicine with id ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một loại thuốc
 * @param id ID của thuốc cần xóa
 */
export const deleteMedicine = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/medicines/${id}`);
  } catch (error) {
    console.error(`❌ Error deleting medicine with id ${id}:`, error);
    throw error;
  }
};
