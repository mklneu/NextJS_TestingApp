import { toast } from "react-toastify";
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
  page: number = 1,
  appointmentsPerPage: number = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/appointments/doctors/${doctorId}?page=${page}&size=${appointmentsPerPage}`
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByDoctorId:", error);
    toast.error("❌ Error while fetching appointment by doctor ID!");
    throw error; // Re-throw để component handle được
  }
};

const getAppointmentByPatientId = async (
  patientId: number,
  page: number = 1,
  appointmentsPerPage: number = 10
) => {
  try {
    const response = await axiosInstance.get(
      `/appointments/patients/${patientId}?page=${page}&size=${appointmentsPerPage}`
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getAppointmentByPatientId:", error);
    toast.error("❌ Error while fetching appointment by patient ID!");
    throw error; // Re-throw để component handle được
  }
};

export {
  createAppointment,
  getAppointmentByDoctorId,
  getAppointmentByPatientId,
};
