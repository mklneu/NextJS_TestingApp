import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/frontend";

// Lấy các ngày có lịch khám theo bệnh viện và chuyên khoa
export const getAvailableDates = async (
  hospitalId: string,
  specialtyId: string
) => {
  try {
    const response = await axiosInstance.get(`/schedules/available-dates`, {
      params: { hospitalId, specialtyId },
    });
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getAvailableDates:", error);
    toast.error(err?.response?.data?.error || "Lỗi khi tải ngày khám.");
    throw error;
  }
};

// Lấy các khung giờ khám theo bệnh viện, chuyên khoa và ngày
export const getAvailableTimeSlots = async (
  hospitalId: string,
  specialtyId: string,
  date: string
) => {
  try {
    const response = await axiosInstance.get(`/schedules/available-slots`, {
      params: { hospitalId, specialtyId, date },
    });
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getAvailableTimeSlots:", error);
    toast.error(err?.response?.data?.error || "Lỗi khi tải khung giờ khám.");
    throw error;
  }
};
