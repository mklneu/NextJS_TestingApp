"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { FaFileUpload, FaStethoscope } from "react-icons/fa";

const CreateTestResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.appointmentId;

  const [testName, setTestName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !diagnosis) {
      toast.error("Vui lòng nhập Tên xét nghiệm và Chẩn đoán.");
      return;
    }

    setLoading(true);
    console.log({
      appointmentId,
      testName,
      diagnosis,
      notes,
      file,
    });

    // TODO: Gọi API để tạo kết quả xét nghiệm
    // const formData = new FormData();
    // formData.append("appointmentId", appointmentId as string);
    // formData.append("testName", testName);
    // formData.append("diagnosis", diagnosis);
    // formData.append("notes", notes);
    // if (file) {
    //   formData.append("file", file);
    // }
    // try {
    //   await createTestResult(formData);
    //   toast.success("Tạo kết quả xét nghiệm thành công!");
    //   router.back();
    // } catch (error) {
    //   toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    // } finally {
    //   setLoading(false);
    // }

    // Giả lập API call
    setTimeout(() => {
      toast.success("Tạo kết quả xét nghiệm thành công!");
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Nút quay lại */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer
           text-gray-600 hover:text-gray-900
            font-semibold mb-6 transition-colors duration-200 focus:outline-none"
        >
          <IoIosArrowBack size={20} />
          Quay lại trang lịch hẹn
        </button>

        {/* Form chính */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl 
          font-bold text-blue-700 mb-6 flex items-center gap-3">
            <FaStethoscope />
            Tạo kết quả xét nghiệm
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên xét nghiệm */}
            <div>
              <label
                htmlFor="testName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tên xét nghiệm
              </label>
              <input
                type="text"
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="bg-gray-50 border outline-none
                border-gray-300 text-gray-900 text-
                sm rounded-lg focus:ring-blue-500 
                focus:border-blue-500 block w-full p-2.5"
                placeholder="Ví dụ: Xét nghiệm máu, Chụp X-quang..."
                required
              />
            </div>

            {/* Chẩn đoán */}
            <div>
              <label
                htmlFor="diagnosis"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Chẩn đoán
              </label>
              <textarea
                id="diagnosis"
                rows={4}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="block p-2.5 w-full outline-none
                text-sm text-gray-900 bg-gray-50 min-h-[40px]
                rounded-lg border border-gray-300 
                focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập kết quả chẩn đoán từ xét nghiệm..."
                required
              ></textarea>
            </div>

            {/* Ghi chú */}
            <div>
              <label
                htmlFor="notes"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Ghi chú của bác sĩ (nếu có)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block p-2.5 w-full outline-none
                text-sm text-gray-900 bg-gray-50 min-h-[40px]
                rounded-lg border border-gray-300 
                focus:ring-blue-500 focus:border-blue-500"
                placeholder="Thêm các ghi chú hoặc diễn giải cần thiết..."
              ></textarea>
            </div>

            {/* Tải tệp lên */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="file_input"
              >
                Tệp đính kèm (PDF, hình ảnh...)
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="file_input"
                  className="cursor-pointer duration-300
                   bg-white border border-gray-300
                    text-gray-700 px-4 py-2 rounded-lg 
                    hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaFileUpload />
                  Chọn tệp
                </label>
                <input
                  className="hidden"
                  id="file_input"
                  type="file"
                  onChange={handleFileChange}
                />
                {file && <span className="text-sm text-gray-600">{file.name}</span>}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm cursor-pointer
                font-medium text-gray-700 duration-300
                bg-gray-100 border border-gray-300
                 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium cursor-pointer
                 text-white bg-blue-600 rounded-lg 
                 hover:bg-blue-700 focus:ring-4 duration-300
                 focus:outline-none focus:ring-blue-300 disabled:bg-blue-300"
              >
                {loading ? "Đang lưu..." : "Lưu kết quả"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTestResultPage;