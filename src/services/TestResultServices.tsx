import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

export interface TestResult {
  id: number;
  patient: { id: number; name?: string };
  doctor: { id: number; name?: string };
  status: string;
  testType: string;
  testTime: string;
  generalConclusion: string;
  attachmentFile?: string;
  detailedTestItems: {
    id: number;
    itemName: string;
    value: number;
    unit: string;
    referenceRange: string;
    notes?: string;
  }[];
}

const getTestResultsByPatientId = async (
  patientId: number
): Promise<TestResult[]> => {
  try {
    const response = await axiosInstance.get(
      `/test-results/patient/${patientId}`
    );
    console.log("Fetched test results:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error(
      `❌ Error fetching test results for patient ${patientId}:`,
      error
    );
    toast.error("Không thể tải danh sách kết quả xét nghiệm.");
    throw error;
  }
};

const getTestResultById = async (testResultId: number): Promise<TestResult> => {
  try {
    const response = await axiosInstance.get(`/test-results/${testResultId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `❌ Error fetching test result with id ${testResultId}:`,
      error
    );
    toast.error("Không thể tải chi tiết kết quả xét nghiệm.");
    throw error;
  }
};

export interface DetailedTestItemBody {
  itemName: string;
  value: number;
  unit: string;
  referenceRange: string;
  notes?: string;
}

export interface TestResultBody {
  patient: { id: number };
  doctor: { id: number };
  status: "COMPLETED" | "PENDING";
  testType: string;
  testTime: string; // ISO 8601 format date string e.g., "2025-10-12T10:30:00Z"
  generalConclusion: string;
  attachmentFile?: string;
  detailedTestItems: DetailedTestItemBody[];
}

export interface UpdateTestResultBody {
  status?: "COMPLETED" | "PENDING" | "REVIEWED";
  testType?: string;
  testTime?: string;
  generalConclusion?: string;
  attachmentFile?: string;
  detailedTestItems?: DetailedTestItemBody[];
}

const createTestResult = async (body: TestResultBody) => {
  try {
    const response = await axiosInstance.post("/test-results", body);
    toast.success("Tạo kết quả xét nghiệm thành công!");
    return response.data.data; // Giả sử API trả về dữ liệu trong 'data.data'
  } catch (error) {
    console.error("❌ Error creating test result:", error);
    toast.error("Có lỗi xảy ra khi tạo kết quả xét nghiệm.");
    throw error;
  }
};

const updateTestResult = async (
  testResultId: number,
  body: UpdateTestResultBody
): Promise<TestResult> => {
  try {
    const response = await axiosInstance.patch(
      `/test-results/${testResultId}`,
      body
    );
    toast.success("Cập nhật kết quả xét nghiệm thành công!");
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error updating test result ${testResultId}:`, error);
    toast.error("Có lỗi xảy ra khi cập nhật kết quả xét nghiệm.");
    throw error;
  }
};

const deleteTestResult = async (
  testResultId: number,
  onSuccess?: () => void
) => {
  if (
    window.confirm(
      `Bạn có chắc chắn muốn xóa kết quả xét nghiệm có ID: ${testResultId}?`
    )
  ) {
    try {
      await axiosInstance.delete(`/test-results/${testResultId}`);
      toast.success(`Đã xóa thành công kết quả xét nghiệm ID: ${testResultId}`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`❌ Error deleting test result ${testResultId}:`, error);
      toast.error("Có lỗi xảy ra khi xóa kết quả xét nghiệm.");
      throw error;
    }
  }
};

export {
  getTestResultsByPatientId,
  getTestResultById,
  createTestResult,
  updateTestResult,
  deleteTestResult,
};
