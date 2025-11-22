import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import Button from "@/components/Button";
import { AxiosError } from "axios";
import {
  ErrorResponse,
  Gender,
  PaginatedResponse,
} from "@/types/frontend";
import { StaffProfile } from "./StaffServices";

export interface PatientProfile {
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
  citizenId: string;
  insuranceId: string;
  bloodType: string;
  medicalHistorySummary: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

export interface ReqUpdatePatient {
  phoneNumber: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  citizenId: string;
  insuranceId: string;
  bloodType: string;
  medicalHistorySummary: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface PatientQueryParams {
  page: number;
  size: number;
  sort?: string;
  searchTerm: string;
  filterGender: string;
  role: string;
}

interface PatientAxiosRequestParams {
  page: number;
  size: number;
  filter?: string; // Thuộc tính filter là tùy chọn
}

const getAllPatients = async (
  params: PatientQueryParams
): Promise<PaginatedResponse<StaffProfile>> => {
  try {
    const { page, size, filterGender, role } = params;

    // Xây dựng các query params cho API
    const queryParams: PatientAxiosRequestParams = {
      page,
      size,
    };

    const filters = [];

    if (role && role !== "ALL") {
      filters.push(`role.name~'${role}'`);
    }
    // Thêm điều kiện lọc theo giới tính
    if (filterGender && filterGender !== "ALL") {
      filters.push(`gender~'${filterGender}'`);
    }
    // Thêm điều kiện tìm kiếm
    if (params.searchTerm && params.searchTerm.trim() !== "") {
      const safeSearchTerm = params.searchTerm.trim().replace(/'/g, "''");
      filters.push(
        `(username~'${safeSearchTerm}' OR email~'${safeSearchTerm}' OR fullName~'${safeSearchTerm}')`
      );
    }

    if (params.filterGender && params.filterGender !== "ALL") {
      filters.push(`gender~'${params.filterGender}'`);
    }

    if (filters.length > 0) {
      queryParams.filter = filters.join("&");
    }

    const response = await axiosInstance.get("/patients", {
      params: queryParams,
    });
    // Giả sử API trả về cấu trúc { data: [...], meta: { pages: ... } }
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error in getAllPatients:", error);
    throw error;
  }
};

const getPatientById = async (patientId: number) => {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getPatientById:", error);
    toast.error("❌ Error while fetching Patient by ID!");
    throw error; // Re-throw để component handle được
  }
};

const postPatient = async (
  username: string,
  fullName: string,
  email: string,
  password: string,
  gender: string,
  address: string,
  dob: string,
  roleId: number
) => {
  try {
    // Uncomment dòng dưới khi có backend
    const response = await axiosInstance.post("/patients", {
      username,
      fullName,
      email,
      password,
      gender,
      address,
      dob,
      role: { id: Number(roleId) },
    });
    toast.success(response.data.message);
    console.log(">>>>>> data Patient", response.data);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in postPatient:", error);
    toast.error(err?.response?.data?.error);
    throw error; // Re-throw để component handle được
  }
};

const updatePatient = async (
  patientId: number,
  patientname: string,
  fullName: string,
  gender: string,
  address: string,
  dob: string,
  company: { id: number },
  role: { id: number }
) => {
  try {
    const response = await axiosInstance.put(`/patients/${patientId}`, {
      patientname,
      gender,
      address,
      fullName,
      dob,
      company,
      role,
    });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updatePatient:", error);
    toast.error(err?.response?.data?.error);
    throw error; // Re-throw để component handle được
  }
};

const deletePatientById = async (patientId: number, onDelete: () => void) => {
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
                    `/patients/${patientId}`
                  );
                  onDelete();
                  toast.success(response.data.message);
                } catch (error) {
                  console.error("❌ Error in deletePatient: ", error);
                  toast.error("❌ Error while deleting Patient!");
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
export {
  getAllPatients,
  getPatientById,
  postPatient,
  updatePatient,
  deletePatientById,
};
