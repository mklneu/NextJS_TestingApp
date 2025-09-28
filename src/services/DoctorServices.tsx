import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
  username: string;
  gender: string;
  specialty: string;
  experienceYears: number;
  address: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  company: { id: number }[];
  //   certifications?: string[];
  //   education?: string;
  //   scheduleDays?: string[];
  //   scheduleHours?: string;
  //   about?: string;
  //   rating?: number;
}

// Lấy tất cả bác sĩ
const getAllDoctors = async () => {
  try {
    const response = await axiosInstance.get("/doctors");
    return response.data.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getAllDoctors:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Không thể lấy danh sách bác sĩ!");
    }
    return [];
  }
};

// Lấy thông tin bác sĩ theo ID
const getDoctorById = async (doctorId: number) => {
  try {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in getDoctorById:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error(`❌ Không thể lấy thông tin bác sĩ ID: ${doctorId}!`);
    }
    throw err;
  }
};

// Tạo bác sĩ mới
const createDoctor = async (doctorData: Omit<Doctor, "id">) => {
  try {
    const response = await axiosInstance.post("/doctors", doctorData);
    toast.success("✅ Thêm bác sĩ thành công!");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in createDoctor:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Lỗi khi thêm bác sĩ!");
    }
    throw err;
  }
};

// Cập nhật thông tin bác sĩ
const updateDoctor = async (
  doctorId: number,
  doctorData: Partial<Omit<Doctor, "id">>
) => {
  try {
    const response = await axiosInstance.put(
      `/doctors/${doctorId}`,
      doctorData
    );
    toast.success("✅ Cập nhật thông tin bác sĩ thành công!");
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updateDoctor:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Lỗi khi cập nhật thông tin bác sĩ!");
    }
    throw err;
  }
};

// Xóa bác sĩ
const deleteDoctor = async (doctorId: number) => {
  try {
    await axiosInstance.delete(`/doctors/${doctorId}`);
    toast.success("✅ Xóa bác sĩ thành công!");
    return true;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in deleteDoctor:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Lỗi khi xóa bác sĩ!");
    }
    throw err;
  }
};

// Cập nhật trạng thái bác sĩ (kích hoạt/vô hiệu hóa)
const updateDoctorStatus = async (
  doctorId: number,
  status: "ACTIVE" | "INACTIVE"
) => {
  try {
    const response = await axiosInstance.patch(`/doctors/${doctorId}/status`, {
      status,
    });
    toast.success(
      `✅ Đã ${
        status === "ACTIVE" ? "kích hoạt" : "vô hiệu hóa"
      } tài khoản bác sĩ!`
    );
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updateDoctorStatus:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Lỗi khi cập nhật trạng thái bác sĩ!");
    }
    throw err;
  }
};

// Helper để xóa bác sĩ và cập nhật giao diện
const deleteDoctorById = async (doctorId: number, callback: () => void) => {
  try {
    await deleteDoctor(doctorId);
    callback();
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in deleteDoctorById:", err);
  }
};

export {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorStatus,
  deleteDoctorById,
};
