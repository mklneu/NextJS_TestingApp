import { ErrorResponse, Gender, PaginatedResponse } from "@/types/frontend";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

export interface StaffProfile {
  profileId: number;
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  employeeId: string;
  department: string;
  hospital: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface ReqUpdateStaff {
  phoneNumber: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  hospitalId: number | string;
  employeeId: string;
  department: string;
}


export interface StaffQueryParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  filterDepartment?: string;
  filterStatus?: string; // e.g., 'ACTIVE', 'INACTIVE', 'ALL'
}

/**
 * Lấy danh sách nhân viên có phân trang và bộ lọc
 * @param params - Các tham số truy vấn (trang, kích thước, sắp xếp, tìm kiếm, lọc...)
 * @returns Promise chứa danh sách nhân viên đã phân trang
 */
const getAllStaff = async (
  params: StaffQueryParams
): Promise<PaginatedResponse<StaffProfile>> => {
  try {
    // 1. Chuẩn bị các tham số cơ bản
    const apiParams: Record<string, string | number> = {
      page: params.page,
      size: params.size,
    };

    if (params.sort) {
      apiParams.sort = params.sort;
    }

    // 2. Xây dựng mảng các điều kiện lọc (filter)
    const filterParts: string[] = [];

    // 3. Thêm logic lọc cho 'search' (tìm kiếm theo SĐT, email, họ tên)
    if (params.search && params.search.trim() !== "") {
      const safeSearchTerm = params.search.trim().replace(/'/g, "''");
      filterParts.push(
        `(phoneNumber~'${safeSearchTerm}' or email~'${safeSearchTerm}' or fullName~'${safeSearchTerm}')`
      );
    }

    // 4. Thêm logic lọc cho 'filterDepartment'
    if (params.filterDepartment && params.filterDepartment !== "ALL") {
      filterParts.push(`department~'${params.filterDepartment}'`);
    }

    // 5. Thêm logic lọc cho 'filterStatus'
    if (params.filterStatus && params.filterStatus !== "ALL") {
      filterParts.push(`status~'${params.filterStatus}'`);
    }

    // 6. Nối tất cả các điều kiện lọc lại bằng ' and '
    if (filterParts.length > 0) {
      apiParams.filter = filterParts.join(" and ");
    }

    // 7. Gửi request đến endpoint của staff (thường là /staffs)
    const response = await axiosInstance.get("/staff", {
      params: apiParams,
    });

    // 8. Trả về dữ liệu phân trang
    return response.data.data;
  } catch (error) {
    // 9. Xử lý lỗi
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getAllStaff:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Không thể lấy danh sách nhân viên!");
    }

    // Trả về một cấu trúc rỗng để tránh lỗi crash component
    return {
      meta: { page: 1, pageSize: params.size, pages: 0, total: 0 },
      data: [],
    };
  }
};

export { getAllStaff };