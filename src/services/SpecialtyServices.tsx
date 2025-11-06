import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/frontend";

export interface Specialty {
  id: string;
  specialtyName: string;
  description: string;
}

// Lấy danh sách chuyên khoa theo ID bệnh viện
export const getSpecialtiesByHospitalId = async (hospitalId: string) => {
  try {
    const response = await axiosInstance.get(
      `/hospitals/${hospitalId}/specialties`
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getSpecialtiesByHospitalId:", error);
    toast.error(
      err?.response?.data?.error || "Lỗi khi tải danh sách chuyên khoa."
    );
    throw error;
  }
};
