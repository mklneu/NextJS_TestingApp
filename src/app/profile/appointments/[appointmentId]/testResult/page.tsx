"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { FaFileUpload, FaStethoscope, FaPlus, FaTrash } from "react-icons/fa";
import {
  createTestResult,
  TestResultBody,
} from "@/services/TestResultServices"; // 1. Import hàm API
import { getInitialGmt7Time } from "@/services/OtherServices";
import { getAppointmentById } from "@/services/AppointmentServices";
import { AxiosError } from "axios";
import Button from "@/components/Button";

// Định nghĩa kiểu dữ liệu cho một chỉ số xét nghiệm
interface TestItem {
  id: number; // Dùng cho key của React
  itemName: string;
  value: string; // Dùng string để dễ quản lý trong input
  unit: string;
  referenceRange: string;
  notes: string;
}

// Định nghĩa các loại xét nghiệm
const testTypeMap: Record<string, string> = {
  HEMATOLOGY_BLOOD_CHEMISTRY: "Xét nghiệm Huyết học - Sinh hóa máu",
  URINALYSIS: "Xét nghiệm Nước tiểu",
  STOOL_TEST: "Xét nghiệm Phân",
  IMAGING_RADIOLOGY: "Chẩn đoán Hình ảnh X-Quang",
  PATHOLOGY_BIOPSY: "Giải phẫu bệnh - Sinh thiết",
  FUNCTIONAL_TEST: "Xét nghiệm Chức năng",
  MICROBIOLOGY: "Vi sinh vật học",
};

const testTypeOptions = Object.entries(testTypeMap).map(([value, label]) => ({
  label,
  value,
}));

const CreateTestResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.appointmentId;

  // State cho các trường chính
  const [testType, setTestType] = useState("HEMATOLOGY_BLOOD_CHEMISTRY");
  const [testTime, setTestTime] = useState(getInitialGmt7Time());
  const [generalConclusion, setGeneralConclusion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // State cho danh sách các chỉ số xét nghiệm động
  const [detailedTestItems, setDetailedTestItems] = useState<TestItem[]>([
    {
      id: 1,
      itemName: "",
      value: "",
      unit: "",
      referenceRange: "",
      notes: "",
    },
  ]);

  // Hàm xử lý thay đổi trong các ô input của chỉ số
  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newItems = [...detailedTestItems];
    newItems[index] = { ...newItems[index], [name]: value };
    setDetailedTestItems(newItems);
  };

  // Hàm thêm một dòng chỉ số mới
  const addItem = () => {
    setDetailedTestItems([
      ...detailedTestItems,
      {
        id: Date.now(),
        itemName: "",
        value: "",
        unit: "",
        referenceRange: "",
        notes: "",
      },
    ]);
  };

  // Hàm xóa một dòng chỉ số
  const removeItem = (index: number) => {
    if (detailedTestItems.length <= 1) {
      toast.info("Phải có ít nhất một chỉ số xét nghiệm.");
      return;
    }
    const newItems = detailedTestItems.filter((_, i) => i !== index);
    setDetailedTestItems(newItems);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isItemsValid = detailedTestItems.every(
      (item) => item.itemName && item.value && item.unit
    );
    if (!generalConclusion || !isItemsValid) {
      toast.error("Vui lòng điền Kết luận chung và các chỉ số bắt buộc.");
      return;
    }

    setLoading(true);

    try {
      // --- BƯỚC 1: Lấy thông tin appointment ---
      let patientId: number;
      let doctorId: number;

      if (appointmentId && typeof appointmentId === "string") {
        const appointmentData = await getAppointmentById(Number(appointmentId));
        patientId = appointmentData.patient.id;
        doctorId = appointmentData.doctor.id;
      } else {
        // Nếu không có ID, ném lỗi để dừng thực thi
        throw new Error("Appointment ID không hợp lệ.");
      }

      // --- BƯỚC 2: Xử lý upload file (nếu có) ---
      let attachmentFileUrl = "";
      if (file) {
        // const formData = new FormData();
        // formData.append("file", file);
        // const uploadResponse = await uploadFileApi(formData);
        // attachmentFileUrl = uploadResponse.data.url;
        attachmentFileUrl = `https://example.com/uploads/${file.name}`; // URL giả
      }

      // --- BƯỚC 3: Chuẩn bị payload với dữ liệu đã được xác thực ---
      const payload: TestResultBody = {
        patient: { id: patientId },
        doctor: { id: doctorId },
        appointment: { id: Number(appointmentId) },
        status: "COMPLETED",
        testType,
        testTime: new Date(testTime).toISOString(),
        generalConclusion,
        attachmentFile: attachmentFileUrl,
        detailedTestItems: detailedTestItems.map((item) => ({
          itemName: item.itemName,
          value: parseFloat(item.value) || 0,
          unit: item.unit,
          referenceRange: item.referenceRange,
          notes: item.notes,
        })),
      };

      console.log("Submitting Test Result:", payload);

      // --- BƯỚC 4: Gọi API tạo kết quả ---
      await createTestResult(payload);
      router.back();
    } catch (error) {
      // Bắt tất cả lỗi từ các bước trên
      const err = error as AxiosError<ErrorResponse> | Error;
      console.error("Submit failed:", err.message);
      toast.error("Tạo kết quả thất bại, vui lòng thử lại.");
    } finally {
      // Luôn luôn tắt loading sau khi hoàn tất
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer
           text-gray-600 hover:text-gray-900
            font-semibold mb-6 transition-colors duration-200 focus:outline-none"
        >
          <IoIosArrowBack size={20} />
          Quay lại trang lịch hẹn
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-8"
        >
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-3">
            <FaStethoscope />
            Tạo kết quả xét nghiệm
          </h1>

          {/* Các trường thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="testType"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Loại xét nghiệm
              </label>
              <select
                id="testType"
                name="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="bg-white border h-[45px]
                border-gray-300 outline-none
                text-gray-900 text-sm rounded-lg focus:ring-blue-500
                 focus:border-blue-500 block w-full p-2.5 
                 placeholder:text-gray-400"
              >
                {testTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="testTime"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Thời gian xét nghiệm
              </label>
              <input
                type="datetime-local"
                id="testTime"
                name="testTime"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="bg-white border
                border-gray-300 outline-none h-[45px]
                text-gray-900 text-sm rounded-lg focus:ring-blue-500
                 focus:border-blue-500 block w-full p-2.5 
                 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Các chỉ số chi tiết */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Các chỉ số chi tiết
            </h2>
            <div className="space-y-4">
              {detailedTestItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-300 rounded-lg bg-gray-50/70 relative"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-[2%]">
                    <input
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Tên chỉ số (Glucose)"
                      className="bg-white border outline-none
                      border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                      required
                    />
                    <input
                      name="value"
                      value={item.value}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Giá trị (95.5)"
                      className="bg-white border outline-none
                      border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                      required
                    />
                    <input
                      name="unit"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Đơn vị (mg/dL)"
                      className="bg-white border outline-none
                      border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                      required
                    />
                    <input
                      name="referenceRange"
                      value={item.referenceRange}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Khoảng tham chiếu (70-100)"
                      className="bg-white border outline-none
                      border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                    />
                    <input
                      name="notes"
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Ghi chú (Bình thường)"
                      className="sm:col-span-2 bg-white border outline-none
                      border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                    />
                  </div>
                  {detailedTestItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute top-2.5 right-[0.5%] text-md cursor-pointer
                      text-red-500 hover:text-red-700 p-1 duration-300"
                      title="Xóa chỉ số"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <Button onClick={addItem} icon={<FaPlus />} size="sm">
                Thêm chỉ số
              </Button>
            </div>
          </div>

          {/* Kết luận chung và file đính kèm */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="generalConclusion"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Kết luận chung
              </label>
              <textarea
                id="generalConclusion"
                rows={4}
                value={generalConclusion}
                onChange={(e) => setGeneralConclusion(e.target.value)}
                className="bg-white border outline-none min-h-10
                      border-gray-300 text-gray-900 
                      text-sm rounded-lg focus:ring-blue-500
                       focus:border-blue-500 block w-full p-2.5
                        placeholder:text-gray-400"
                placeholder="Nhập kết luận chung của bác sĩ..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tệp đính kèm
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="file_input"
                  className="cursor-pointer bg-white border outline-none
                  border-gray-300 text-gray-700 duration-300
                  px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaFileUpload /> Chọn tệp
                </label>
                <input
                  className="hidden"
                  id="file_input"
                  type="file"
                  onChange={handleFileChange}
                />
                {file && (
                  <span className="text-sm text-gray-600">{file.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={() => router.back()} variant="secondary" size="sm">
              Hủy
            </Button>
            <Button isLoading={loading} size="sm">
              {loading ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTestResultPage;
