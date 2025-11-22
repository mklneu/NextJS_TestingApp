"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { FaStethoscope, FaVial } from "react-icons/fa"; // 1. Import hàm API mới
import { AxiosError } from "axios";
import Button from "@/components/Button";
import { ErrorResponse } from "@/types/frontend";
import { testTypeOptions } from "@/utils/map";
import { requestTestResult } from "@/services/TestResultServices";

// Định nghĩa kiểu dữ liệu cho body gửi đi
interface TestIndicationBody {
  appointmentId: number;
  testTypes: string[];
}

const IndicateTestResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  // State để lưu danh sách các loại xét nghiệm đã chọn
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi người dùng check/uncheck một loại xét nghiệm
  const handleTestTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      // Nếu check, thêm vào danh sách
      setSelectedTestTypes((prev) => [...prev, value]);
    } else {
      // Nếu bỏ check, loại bỏ khỏi danh sách
      setSelectedTestTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTestTypes.length === 0) {
      toast.error("Vui lòng chọn ít nhất một loại xét nghiệm.");
      return;
    }

    setLoading(true);

    try {
      const payload: TestIndicationBody = {
        appointmentId: Number(appointmentId),
        testTypes: selectedTestTypes,
      };

      console.log("Submitting Test Indications:", payload);

      // Gọi API mới để chỉ định xét nghiệm
      await requestTestResult(payload);

      // toast.success("Chỉ định xét nghiệm thành công!");
      router.back();
    } catch (error) {
      const err = error as AxiosError<ErrorResponse> | Error;
      console.error("Submit failed:", err.message);
      toast.error("Chỉ định xét nghiệm thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
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
            Chỉ định Xét nghiệm
          </h1>

          {/* Danh sách các loại xét nghiệm để chọn */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Chọn các loại xét nghiệm cần thực hiện
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testTypeOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTestTypes.includes(opt.value)
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={selectedTestTypes.includes(opt.value)}
                    onChange={handleTestTypeChange}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-800">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={() => router.back()} variant="secondary" size="sm">
              Hủy
            </Button>
            <Button
              isLoading={loading}
              size="sm"
              icon={<FaVial />}
              type="submit"
            >
              {loading ? "Đang lưu..." : "Chỉ định"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndicateTestResultPage;
