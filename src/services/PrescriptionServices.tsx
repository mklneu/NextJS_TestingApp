import axiosInstance from "./axiosInstance";

// Body chính để tạo hoặc cập nhật một đơn thuốc
export interface PrescriptionBody {
  patient: { id: number };
  doctor: { id: number };
  appointment: { id: number };
  prescriptionDate: string;
  diagnosis: string;
  advice: string;
  testResultIds?: number[];
  prescriptionItems: PrescriptionItemBody[];
}

// Body để tạo mới một mục thuốc trong đơn
export interface PrescriptionItemBody {
  medicine: { id: number };
  unit: string;
  quantity: number | string;
  usageInstructions: string;
  note?: string;
}

// Dữ liệu trả về hoàn chỉnh cho một đơn thuốc
export interface Prescription {
  id: number;
  patient: { id: number ; name: string};
  doctor: { id: number ; name: string};
  appointment: { id: number };
  prescriptionDate: string;
  diagnosis: string;
  advice: string;
  totalCost: number;
  prescriptionItems: PrescriptionItemResponse[];
  testResults: TestResultItem[];
}

// Dữ liệu trả về cho một mục thuốc (có thêm thông tin tên thuốc)
export interface PrescriptionItemResponse {
  id: number;
  medicine: {
    id: number;
    name: string;
  };
  unit: string;
  quantity: number | string;
  priceAtTimeOfPrescription: number;
  usageInstructions: string;
  note?: string;
}

export interface TestResultItem {
  id: number;
  testType: string;
  testTime: string;
}

// --- 2. Các hàm gọi API ---

/**
 * Tạo một đơn thuốc mới
 * @param body Dữ liệu của đơn thuốc
 * @returns Đơn thuốc vừa được tạo
 */
const createPrescription = async (
  body: PrescriptionBody
): Promise<Prescription> => {
  try {
    const response = await axiosInstance.post("/prescriptions", body);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một đơn thuốc bằng ID
 * @param id ID của đơn thuốc
 * @returns Dữ liệu chi tiết của đơn thuốc
 */
const getPrescriptionById = async (id: number): Promise<Prescription> => {
  try {
    const response = await axiosInstance.get(`/prescriptions/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error fetching prescription with id ${id}:`, error);
    throw error;
  }
};

const getPrescriptionsByPatientId = async (
  patientId: number
): Promise<Prescription[]> => {
  try {
    const response = await axiosInstance.get(
      `/prescriptions/patient/${patientId}`
    );
    // console.log("Fetched prescriptions:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error(
      `❌ Error fetching prescriptions with patient ${patientId}:`,
      error
    );
    throw error;
  }
};

/**
 * Lấy danh sách các đơn thuốc theo ID của buổi khám
 * @param appointmentId ID của buổi khám
 * @returns Mảng các đơn thuốc
 */
const getPrescriptionsByAppointmentId = async (
  appointmentId: number
): Promise<Prescription[]> => {
  try {
    const response = await axiosInstance.get(
      `/prescriptions/appointment/${appointmentId}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error(
      `❌ Error fetching prescriptions for appointment ${appointmentId}:`,
      error
    );
    throw error;
  }
};

/**
 * Cập nhật một đơn thuốc đã có
 * @param id ID của đơn thuốc cần cập nhật
 * @param body Dữ liệu mới của đơn thuốc
 * @returns Đơn thuốc sau khi đã được cập nhật
 */
const updatePrescription = async (
  id: number,
  body: Partial<PrescriptionBody> // Dùng Partial để cho phép cập nhật một phần
): Promise<Prescription> => {
  try {
    const response = await axiosInstance.put(`/prescriptions/${id}`, body);
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error updating prescription with id ${id}:`, error);
    throw error;
  }
};

export {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPatientId,
  getPrescriptionsByAppointmentId,
  updatePrescription,
};
