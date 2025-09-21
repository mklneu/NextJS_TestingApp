import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  specialty: string;
  experienceYears: number;
  address: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
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
    // Trong dự án thực tế, bạn sẽ gọi API thực sự
    const response = await axiosInstance.get("/doctors");
    return response.data.data.data;
  } catch (error: any) {
    console.error("❌ Error in getAllDoctors:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("❌ Không thể lấy danh sách bác sĩ!");
    }

    // Trả về mảng rỗng nếu có lỗi
    return [];
  }
};

// Lấy thông tin bác sĩ theo ID
const getDoctorById = async (doctorId: number) => {
  try {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error in getDoctorById:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error(`❌ Không thể lấy thông tin bác sĩ ID: ${doctorId}!`);
    }

    throw error;
  }
};

// Tạo bác sĩ mới
const createDoctor = async (doctorData: Omit<Doctor, "id">) => {
  try {
    const response = await axiosInstance.post("/doctors", doctorData);
    toast.success("✅ Thêm bác sĩ thành công!");
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error in createDoctor:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("❌ Lỗi khi thêm bác sĩ!");
    }

    throw error;
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
  } catch (error: any) {
    console.error("❌ Error in updateDoctor:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("❌ Lỗi khi cập nhật thông tin bác sĩ!");
    }

    throw error;
  }
};

// Xóa bác sĩ
const deleteDoctor = async (doctorId: number) => {
  try {
    await axiosInstance.delete(`/doctors/${doctorId}`);
    toast.success("✅ Xóa bác sĩ thành công!");
    return true;
  } catch (error: any) {
    console.error("❌ Error in deleteDoctor:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("❌ Lỗi khi xóa bác sĩ!");
    }

    throw error;
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
  } catch (error: any) {
    console.error("❌ Error in updateDoctorStatus:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("❌ Lỗi khi cập nhật trạng thái bác sĩ!");
    }

    throw error;
  }
};

// Helper để xóa bác sĩ và cập nhật giao diện
const deleteDoctorById = async (doctorId: number, callback: () => void) => {
  try {
    await deleteDoctor(doctorId);
    callback(); // Gọi callback để cập nhật UI
  } catch (error) {
    console.error("❌ Error in deleteDoctorById:", error);
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
