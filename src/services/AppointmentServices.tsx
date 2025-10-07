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

export const createAppointment = async (body: AppointmentBody) => {
  try {
    await axiosInstance.post("/appointments", body);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    throw err.response?.data?.message || err.message || "Có lỗi xảy ra";
  }
};
