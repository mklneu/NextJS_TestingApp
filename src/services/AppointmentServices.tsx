import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import { Appointment, ErrorResponse, PaginatedResponse } from "@/types/frontend";
import { toast } from "react-toastify";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

// Interface cho các tham số truyền vào hàm service
interface AppointmentRequestParams {
  sortField: string;
  sortOrder: string;
  page: number;
  appointmentsPerPage: number;
  filterStatus: string;
}

// Interface cho đối tượng params sẽ được gửi đi trong request của Axios
interface AxiosRequestParams {
  page: number;
  size: number;
  sort: string;
  filter?: string; // Thuộc tính filter là tùy chọn (optional)
}

interface AppointmentBody {
  patient: { id: number | undefined };
  doctor: { id: number | undefined };
  appointmentDate: string;
  patientNote: string;
  appointmentType: string;
  notificationSent?: boolean;
}

export interface CompleteAppointmentBody {
  doctorNote: string;
  testResultIds: number[];
  prescriptionIds: number[];
}

export interface ConfirmAppointmentPayload {
  clinicRoom: string;
  doctorNote?: string; // Để là optional nếu ghi chú không bắt buộc
}

interface AppointmentQueryParams {
  page: number;  
  size: number;  
  sort?: string; 
  search?: string; // Tên gợi nhớ ở FE: "Tìm bệnh nhân, bác sĩ..."
  status?: string; // Tên gợi nhớ ở FE: "Lọc theo trạng thái"
  appointmentType?: string; // Tên gợi nhớ ở FE: "Lọc theo loại lịch hẹn"
}

const createAppointment = async (body: AppointmentBody) => {
  try {
    const res = await axiosInstance.post("/appointments", body);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    throw err.response?.data?.message || err.message || "Có lỗi xảy ra";
  }
};

const getAllAppointments = async (
  params: AppointmentQueryParams
): Promise<PaginatedResponse<Appointment>> => {
  try {
    // 2. Chuẩn bị các tham số cơ bản
    const apiParams: Record<string, string | number | string[]> = {
      page: params.page,
      size: params.size,
    };

    if (params.sort) {
      apiParams.sort = params.sort;
    }

    // 3. Xây dựng mảng các điều kiện lọc (filter)
    const filterParts: string[] = [];

    // 4. Thêm logic lọc cho 'search' (tìm theo tên BN hoặc BS)
    if (params.search && params.search.trim() !== "") {
      const safeSearchTerm = params.search.trim().replace(/'/g, "''");
      // Dùng logic OR giống như file TestResult
      filterParts.push(`(patient.fullName~'${safeSearchTerm}' or doctor.fullName~'${safeSearchTerm}')`);
    }

    // 5. Thêm logic lọc cho 'status'
    if (params.status && params.status !== "ALL") { 
      filterParts.push(`status~'${params.status}'`);
    }

    // 6. Thêm logic lọc cho 'appointmentType'
    if (params.appointmentType && params.appointmentType !== "ALL") { 
      filterParts.push(`appointmentType~'${params.appointmentType}'`);
    }

    // 7. Nối tất cả các điều kiện lọc lại bằng ' and '
    if (filterParts.length > 0) {
      // Gửi 'filter' dưới dạng một chuỗi duy nhất, nối bằng ' and '
      // Backend (RSQL) sẽ phân tích chuỗi này
      apiParams.filter = filterParts.join(" and ");
    }

    // 8. Gửi request
    const response = await axiosInstance.get("/appointments", {
      params: apiParams,
    });

    // 9. Trả về toàn bộ DTO phân trang
    return response.data.data;

  } catch (error) {
    // 10. Xử lý lỗi với toast
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error fetching all appointments:", err);
    
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Không thể lấy danh sách lịch hẹn!");
    }
    
    // Trả về một cấu trúc rỗng để tránh lỗi ở component
    return {
        meta: { page: 1, pageSize: params.size, pages: 0, total: 0 },
        data: []
    };
  }
};

const getAppointmentById = async (appointmentId: number) => {
  try {
    const response = await axiosInstance.get(`/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentById:", error);
    throw error;
  }
};

const getAppointmentByDoctorId = async (
  doctorId: number,
  params: AppointmentRequestParams
) => {
  const { sortField, sortOrder, page, appointmentsPerPage, filterStatus } =
    params;
  try {
    // Khai báo requestParams với kiểu dữ liệu rõ ràng
    const requestParams: AxiosRequestParams = {
      page,
      size: appointmentsPerPage,
      sort: `${sortField},${sortOrder}`,
    };

    // Nếu filterStatus không phải "ALL", thêm tham số filter vào request
    if (filterStatus !== "ALL") {
      requestParams.filter = `status ~ '${filterStatus}'`;
    }

    const response = await axiosInstance.get(
      `/appointments/doctors/${doctorId}`,
      { params: requestParams }
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByDoctorId:", error);
    throw error;
  }
};

const getAppointmentByPatientId = async (
  patientId: number,
  params: AppointmentRequestParams
) => {
  const { sortField, sortOrder, page, appointmentsPerPage, filterStatus } =
    params;
  try {
    // Khai báo requestParams với kiểu dữ liệu rõ ràng
    const requestParams: AxiosRequestParams = {
      page,
      size: appointmentsPerPage,
      sort: `${sortField},${sortOrder}`,
    };

    // Nếu filterStatus không phải "ALL", thêm tham số filter vào request
    if (filterStatus !== "ALL") {
      requestParams.filter = `status ~ '${filterStatus}'`;
    }

    const response = await axiosInstance.get(
      `/appointments/patients/${patientId}`,
      { params: requestParams }
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByPatientId:", error);
    throw error;
  }
};

const confirmAppointment = async (
  appointmentId: number,
  payload: ConfirmAppointmentPayload
) => {
  return await axiosInstance.patch(
    `/appointments/${appointmentId}/confirm`,
    payload // <-- Gửi payload làm body của request
  );
};

const cancelAppointment = async (
  appointmentId: number,
  note: string,
  role: string = "doctor"
) => {
  return await axiosInstance.patch(
    `/appointments/${appointmentId}/cancel`,
    null,
    {
      params: { note, role },
    }
  );
};

const completeAppointment = async (
  appointmentId: number,
  payload: CompleteAppointmentBody // <-- Nhận vào một object payload
) => {
  return await axiosInstance.put(
    `/appointments/${appointmentId}/complete`,
    payload // <-- Gửi payload làm body của request, không dùng params nữa
  );
};

export {
  getAllAppointments,
  getAppointmentByDoctorId,
  getAppointmentByPatientId,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointment,
};
