// import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

export interface AppointmentBody {
  patient: { id: number };
  doctor: { id: number };
  appointmentDate: string;
  patientNote: string;
  doctorNote: string;
  clinicRoom: string;
  appointmentType: string;
  notificationSent?: boolean;
}

const createAppointment = async (body: AppointmentBody) => {
  try {
    await axiosInstance.post("/appointments", body);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    throw err.response?.data?.message || err.message || "Có lỗi xảy ra";
  }
};

const getAppointmentByDoctorId = async (
  doctorId: number,
  sortField: string,
  sortOrder: string,
  page: number = 1,
  appointmentsPerPage: number = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/appointments/doctors/${doctorId}`,
      {
        params: {
          page,
          size: appointmentsPerPage,
          sort: `${sortField},${sortOrder}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByDoctorId:", error);
    // toast.error("❌ Error while fetching appointment by doctor ID!");
    throw error; // Re-throw để component handle được
  }
};

const getAppointmentByPatientId = async (
  patientId: number,
  sortField: string,
  sortOrder: string,
  page: number = 1,
  appointmentsPerPage: number = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/appointments/patients/${patientId}`,
      {
        params: {
          page,
          size: appointmentsPerPage,
          sort: `${sortField},${sortOrder}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByPatientId:", error);
    // toast.error("❌ Error while fetching appointment by patient ID!");
    throw error; // Re-throw để component handle được
  }
};

const confirmAppointment = async (
  appointmentId: number,
  doctorNote: string
) => {
  return await axiosInstance.patch(
    `/appointments/${appointmentId}/confirm`,
    null,
    {
      params: { doctorNote },
    }
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
  doctorNote: string
) => {
  return await axiosInstance.patch(
    `/appointments/${appointmentId}/complete`,
    null,
    { params: { doctorNote } }
  );
};
export {
  createAppointment,
  getAppointmentByDoctorId,
  getAppointmentByPatientId,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
};
