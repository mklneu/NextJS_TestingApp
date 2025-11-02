import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/frontend";

export interface Overview {
    totalUsers: number;
    totalPatients: number;
    totalDoctors: number;
    totalStaff: number;
    // totalHospitals: number;
    totalAppointments: number;
    revenue: number;
    pendingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
}

export const getOverviewStatistics = async () => {
  try {
    const response = await axiosInstance.get("/statistics/overview");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getOverviewStatistics:", error);
    toast.error(err?.response?.data?.error || "Lỗi khi tải dữ liệu thống kê.");
    throw error;
  }
};
