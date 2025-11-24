import { ErrorResponse, Gender, PaginatedResponse } from "@/types/frontend";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import Button from "@/components/Button";

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

export interface ReqCreateStaff {
  username: string;
  email: string;
  password?: string; // Có thể optional nếu BE tự gen, nhưng trong hình m có gửi
  phoneNumber: string;
  fullName: string;
  dob: string; // Format: "YYYY-MM-DD"
  gender: Gender; // "MALE" | "FEMALE"
  address: string;
  hospitalId: number;

  // 2 trường quan trọng của Staff
  employeeId: string; // VD: "NV1002"
  department: string; // VD: "IT_SUPPORT" (Phải khớp Enum BE)
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
  // filterDepartment?: string;
  // filterStatus?: string; // e.g., 'ACTIVE', 'INACTIVE', 'ALL'
  filterGender?: string;
}

const createStaff = async (data: ReqCreateStaff) => {
  try {
    const response = await axiosInstance.post("/staff", data);
    toast.success("Thêm nhân viên thành công!");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in createStaff:", err);
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Không thể tạo nhân viên mới!");
    }
  }
};

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

    if (params.filterGender && params.filterGender !== "ALL") {
      filterParts.push(`gender~'${params.filterGender}'`);
    }

    // 3. Thêm logic lọc cho 'search' (tìm kiếm theo SĐT, email, họ tên)
    if (params.search && params.search.trim() !== "") {
      const safeSearchTerm = params.search.trim().replace(/'/g, "''");
      filterParts.push(
        `user.phoneNumber~'${safeSearchTerm}' OR user.email~'${safeSearchTerm}' OR fullName~'${safeSearchTerm}' OR user.username~'${safeSearchTerm}'`
      );
    }

    // 4. Thêm logic lọc cho 'filterDepartment'
    // if (params.filterDepartment && params.filterDepartment !== "ALL") {
    //   filterParts.push(`department~'${params.filterDepartment}'`);
    // }

    // // 5. Thêm logic lọc cho 'filterStatus'
    // if (params.filterStatus && params.filterStatus !== "ALL") {
    //   filterParts.push(`status~'${params.filterStatus}'`);
    // }

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

const getStaffById = async (staffId: number) => {
  try {
    const response = await axiosInstance.get(`/staff/${staffId}`);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getstaffById:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error(`❌ Không thể lấy thông tin bác sĩ ID: ${staffId}!`);
    }
    throw err;
  }
};

const updateStaffById = async (
  staffId: number,
  staffData: Partial<StaffProfile>
) => {
  try {
    const response = await axiosInstance.put(`/staff/${staffId}`, staffData);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updateStaff:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Lỗi khi cập nhật thông tin nhân viên!");
    }
    throw err;
  }
};

const deleteStaffById = async (staffId: number, onDelete: () => void) => {
  // Custom confirm toast
  const confirmDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col p-2 w-full">
          <div className="flex items-center mb-3">
            <span className="font-medium text-gray-800">
              Bạn muốn xóa người dùng này?
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={async () => {
                closeToast();
                try {
                  const response = await axiosInstance.delete(
                    `/staff/${staffId}`
                  );
                  onDelete();
                  toast.success(response.data.message);
                } catch (error) {
                  console.error("❌ Error in deleteStaff: ", error);
                  toast.error("❌ Error while deleting staff!");
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Xóa
            </Button>
            <Button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Hủy
            </Button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        className: "custom-confirm-toast",
      }
    );
  };

  confirmDelete();
};

export { createStaff, getAllStaff, getStaffById, updateStaffById, deleteStaffById };
