import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

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
  patient: { id: number | undefined};
  doctor: { id: number | undefined};
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

const createAppointment = async (body: AppointmentBody) => {
  try {
    const res = await axiosInstance.post("/appointments", body);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    throw err.response?.data?.message || err.message || "Có lỗi xảy ra";
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
  getAppointmentByDoctorId,
  getAppointmentByPatientId,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointment,
};
