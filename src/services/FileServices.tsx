import axiosInstance from "./axiosInstance";

// 1. Định nghĩa interface cho response của API upload
export interface FileUploadResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: {
    fileName: string;
    uploadedAt: string;
  };
}

/**
 * Upload một file lên server.
 * @param file File object cần upload.
 * @param folder Tên thư mục đích trên server (ví dụ: "test-results").
 * @returns Promise chứa response từ API (đã được định nghĩa).
 */
const uploadFile = async (
  file: File,
  folder: string
): Promise<FileUploadResponse> => {
  // 1. Tạo đối tượng FormData
  const formData = new FormData();

  // 2. Thêm file và tên thư mục vào FormData
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    // 3. Gửi request POST với FormData
    const response = await axiosInstance.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // 4. Trả về toàn bộ data của response
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw error; // Ném lỗi ra để handleSubmit có thể bắt được
  }
};

// --- HÀM TRỢ GIÚP ĐỂ LÀM SẠCH TÊN FILE ---
const sanitizeFileName = (fileName: string): string => {
  // 1. Tách phần tên và phần mở rộng (extension)
  // Đảm bảo an toàn nếu file không có dấu chấm
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) {
    // Không có phần mở rộng
    return `${fileName
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, "_")
      .replace(/_+/g, "_")}`;
  }

  const fileExtension = fileName.slice(lastDot); // Lấy ".png"
  const fileNameWithoutExt = fileName.slice(0, lastDot); // Lấy "Screenshot 2025-10-03 135407"

  // 2. Làm sạch phần tên
  const sanitizedName = fileNameWithoutExt
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/[^a-z0-9_.-]/g, "_") // Thay thế mọi ký tự đặc biệt, dấu cách, tiếng Việt... bằng dấu gạch dưới "_"
    .replace(/_+/g, "_"); // Thay thế nhiều dấu gạch dưới liên tiếp thành 1 dấu

  // 3. Ghép lại với một timestamp để đảm bảo tên là duy nhất
  return `${sanitizedName}${fileExtension}`;
};
// ------------------------------------------

export { sanitizeFileName, uploadFile };
