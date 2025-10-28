import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { ErrorResponse, PaginatedResponse, TestResultStatus } from "@/types/frontend";

export interface TestResult {
  id: number;
  patient: { id: number; name: string };
  doctor: { id: number; name: string };
  appointment: { id: number };
  status: TestResultStatus;
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

export interface TestResultBody {
  patient: { id: number };
  doctor: { id: number };
  appointment: { id: number };
  status: TestResultStatus;
  testType: string;
  testTime: string; // ISO 8601 format date string e.g., "2025-10-12T10:30:00Z"
  generalConclusion: string;
  attachmentFile?: string;
  detailedTestItems: DetailedTestItemBody[];
}

export interface UpdateTestResultBody {
  status?: TestResultStatus;
  generalConclusion?: string;
  attachmentFile?: string;
  detailedTestItems?: DetailedTestItemBody[];
}

export interface DetailedTestItemBody {
  itemName: string;
  value: number;
  unit: string;
  referenceRange: string;
  notes?: string;
}

// --- 1. Định nghĩa interface cho các tham số ---
// Định nghĩa các tham số đầu vào cho việc chia trang và sắp xếp
interface QueryParams {
  page: number; // Số trang hiện tại (bắt đầu từ 1)
  size: number; // Số lượng kết quả trên mỗi trang
  sort?: string; // Chuỗi sắp xếp, ví dụ: "createdAt,desc"
  search?: string; // Thêm: Lọc theo từ khóa tìm kiếm (từ ô input)
  testType?: string; // Thêm: Lọc theo loại xét nghiệm (từ dropdown)
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

const getAllTestResults = async (
  params: QueryParams
): Promise<PaginatedResponse<TestResult>> => {
  // Giữ nguyên kiểu trả về
  try {
    // 1. Chuẩn bị các tham số cơ bản
    const apiParams: Record<string, string | number> = {
      page: params.page,
      size: params.size,
    };

    if (params.sort) {
      apiParams.sort = params.sort;
    }

    // 2. Xây dựng mảng các điều kiện lọc (filter)
    const filterParts: string[] = [];

    // 3. Thêm logic lọc cho 'search' (với cú pháp OR)
    if (params.search && params.search.trim() !== "") {
      // Làm sạch input để tránh lỗi cú pháp (ví dụ: nếu người dùng gõ dấu ')
      const safeSearchTerm = params.search.trim().replace(/'/g, "''");

      // Xây dựng chuỗi OR theo đúng cú pháp BE của bạn
      // (patient.fullName~'term' or doctor.fullName~'term')
      const searchOrLogic = `(patient.fullName~'${safeSearchTerm}' or doctor.fullName~'${safeSearchTerm}')`;
      filterParts.push(searchOrLogic);
    }

    // 4. Thêm logic lọc cho 'testType' (nối bằng AND)
    // Giả sử cú pháp lọc testType là testType=='VALUE' (hoặc ~ nếu bạn muốn)
    if (params.testType && params.testType !== "ALL") {
      filterParts.push(`testType = '${params.testType}'`);
    }

    // 5. Nối tất cả các điều kiện lọc lại bằng ' and '
    if (filterParts.length > 0) {
      apiParams.filter = filterParts.join(" and ");
    }

    // 6. Gửi request
    // Axios sẽ tự động tạo URL, ví dụ:
    // ...?page=0&size=10&filter=(patient.fullName~'khánh' or doctor.fullName~'khánh') and testType=='BLOOD_TEST'
    const response = await axiosInstance.get("/test-results", {
      params: apiParams,
    });

    return response.data.data;
  } catch (error) {
    // 5. Thêm xử lý lỗi với toast (giống getAllDoctors)
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error fetching all test results:", err);

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("❌ Không thể lấy danh sách kết quả xét nghiệm!");
    }

    // Trả về một cấu trúc rỗng để tránh lỗi ở component
    return {
      meta: { page: 1, pageSize: params.size, pages: 0, total: 0 },
      data: [],
    };
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

const getTestResultsByAppointmentId = async (
  appointmentId: number
): Promise<TestResult[]> => {
  try {
    const response = await axiosInstance.get(
      `/test-results/appointment/${appointmentId}`
    );
    // Giả sử API trả về mảng trong response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching test results by appointment:", error);
    throw error;
  }
};

const updateTestResult = async (
  testResultId: number,
  body: UpdateTestResultBody
): Promise<TestResult> => {
  try {
    const response = await axiosInstance.put(
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
  getAllTestResults,
  getTestResultsByPatientId,
  getTestResultById,
  getTestResultsByAppointmentId,
  createTestResult,
  updateTestResult,
  deleteTestResult,
};
