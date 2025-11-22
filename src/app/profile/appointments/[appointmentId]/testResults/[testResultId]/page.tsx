"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import {
  FaStethoscope,
  FaEdit,
  FaFileUpload,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineSaveAlt, MdOutlineCancel } from "react-icons/md";
import {
  getTestResultById,
  updateTestResult, // 1. Import hàm update
  TestResult,
  detailedTestItems,
  reviewTestResult,
} from "@/services/TestResultServices";
import { AxiosError } from "axios";
import { translateTestType } from "@/utils/translateEnums";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeFileName, uploadFile } from "@/services/FileServices";
import { ErrorResponse } from "@/types/frontend";
import StaffOrDoctorOnly from "@/components/StaffOrDoctorOnly";

const TestResultDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const testResultId = params.testResultId as string;

  const { userRole, STORAGE_BASE_URL, folderName } = useAuth();

  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Thêm state cho chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<TestResult | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newFile, setNewFile] = useState<File | null>(null);
  const fileUrl = `${STORAGE_BASE_URL}/${folderName}/${testResult?.attachmentFile}`;

  useEffect(() => {
    if (!testResultId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTestResultById(Number(testResultId));
        setTestResult(data);
        setEditableData(JSON.parse(JSON.stringify(data))); // Tạo bản sao sâu để chỉnh sửa
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("Error fetching test result:", err.message);
        toast.error("Không thể tải chi tiết kết quả xét nghiệm.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testResultId]);

  // 3. Hàm xử lý khi thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableData) return;
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const handleDetailChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableData) return;
    const { name, value } = e.target;

    const updatedDetails = [...editableData.detailedTestItems];
    const itemToUpdate = { ...updatedDetails[index] };

    type EditableStringKey = "itemName" | "unit" | "referenceRange" | "notes";

    if (name === "value") {
      // Cho phép ô input rỗng, nếu không thì parse thành số
      itemToUpdate.value = value === "" ? "" : parseFloat(value) || 0;
    } else if (["itemName", "unit", "referenceRange", "notes"].includes(name)) {
      // Giờ 'name' đã được thu hẹp, chúng ta có thể ép kiểu an toàn
      itemToUpdate[name as EditableStringKey] = value;
    }

    updatedDetails[index] = { ...updatedDetails[index], [name]: value };
    setEditableData({ ...editableData, detailedTestItems: updatedDetails });
  };

  const addItem = () => {
    if (!editableData) return;
    const newItem: detailedTestItems = {
      id: Date.now(), // Key tạm
      itemName: "",
      value: "", // Bắt đầu là string rỗng
      unit: "",
      referenceRange: "",
      notes: "",
    };
    setEditableData({
      ...editableData,
      detailedTestItems: [...editableData.detailedTestItems, newItem],
    });
  };

  const removeItem = (index: number) => {
    if (!editableData || editableData.detailedTestItems.length === 0) return;

    if (editableData.detailedTestItems.length === 1) {
      toast.info("Phải có ít nhất một chỉ số xét nghiệm.");
      return;
    }

    const newItems = editableData.detailedTestItems.filter(
      (_, i) => i !== index
    );
    setEditableData({
      ...editableData,
      detailedTestItems: newItems,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];

      // 1. Lấy tên file gốc
      const originalName = originalFile.name;

      // 2. Tạo tên file "sạch"
      const sanitizedName = sanitizeFileName(originalName);

      // 3. Tạo một đối tượng File MỚI với tên đã được làm sạch
      // File object là bất biến, nên chúng ta phải tạo một file mới
      // new File([nội dung file], [tên file mới], { type: [kiểu file] })
      const newFileWithSanitizedName = new File([originalFile], sanitizedName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });

      // 4. Lưu file MỚI này vào state
      setNewFile(newFileWithSanitizedName);

      console.log("Original Filename:", originalName);
      console.log("Sanitized Filename:", sanitizedName);
    }
  };

  const confirmAndUpdate = () => {
    if (!editableData) return;

    // Xác định thông báo dựa trên sự thay đổi trạng thái tiềm năng
    let confirmationMessage =
      "Bạn có chắc chắn muốn lưu các thay đổi này không?";
    if (editableData.status === "IN_PROGRESS") {
      confirmationMessage =
        "Lưu thay đổi sẽ cập nhật trạng thái thành 'Đã hoàn thành'. Bạn có chắc chắn?";
    } else if (userRole === "doctor" && editableData.status === "COMPLETED") {
      confirmationMessage =
        "Lưu thay đổi sẽ cập nhật trạng thái thành 'Đã xem'. Bạn có chắc chắn?";
    }

    // Component nội dung của toast
    const Confirmation = ({ closeToast }: { closeToast: () => void }) => (
      <div>
        <p className="text-sm">{confirmationMessage}</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={() => {
              handleUpdate();
              closeToast();
            }}
            className="px-3 py-1 text-sm cursor-pointer duration-300
            font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Xác nhận
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 text-sm cursor-pointer duration-300
            font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      </div>
    );

    // Hiển thị toast - sử dụng render-prop để toast cung cấp closeToast cho component
    toast(({ closeToast }) => <Confirmation closeToast={closeToast} />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
  };

  const handleUpdate = async () => {
    if (!editableData) return;
    setIsUpdating(true);

    const isItemsValid = editableData.detailedTestItems.every(
      (item) => item.itemName && item.value !== "" && item.unit
    );
    if (!editableData.generalConclusion || !isItemsValid) {
      toast.error("Vui lòng điền Kết luận chung và các chỉ số bắt buộc.");
      setIsUpdating(false);
      return;
    }

    try {
      let finalAttachmentName = editableData.attachmentFile;

      if (newFile) {
        try {
          const uploadResponse = await uploadFile(newFile, folderName);
          if (
            uploadResponse &&
            uploadResponse.data &&
            uploadResponse.data.fileName
          ) {
            finalAttachmentName = uploadResponse.data.fileName;
          } else {
            throw new Error("API upload không trả về fileName.");
          }
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          toast.error("Tải file đính kèm mới thất bại.");
          setIsUpdating(false);
          return;
        }
      }

      // --- SỬA LỖI Ở ĐÂY: LOGIC CẬP NHẬT TRẠNG THÁI TỰ ĐỘNG ---
      let nextStatus = editableData.status; // Giữ nguyên trạng thái mặc định

      // Logic cho Nhân viên Lab / Y tá
      if (userRole === "staff") {
        // Chỉ tự động chuyển từ IN_PROGRESS -> COMPLETED
        if (editableData.status === "IN_PROGRESS") {
          nextStatus = "COMPLETED";
          toast.info("Trạng thái đã được cập nhật thành 'Đã hoàn thành'.");
        }
      }
      // Logic cho Bác sĩ
      else if (userRole === "doctor") {
        // SỬA LỖI LOGIC: Bổ sung trường hợp bác sĩ tự nhập kết quả
        // if (editableData.status === "IN_PROGRESS") {
        //   nextStatus = "COMPLETED";
        //   toast.info("Trạng thái đã được cập nhật thành 'Đã hoàn thành'.");
        // }
        // Nếu bác sĩ đang xem lại kết quả đã hoàn thành
        if (editableData.status === "COMPLETED") {
          nextStatus = "REVIEWED";
          toast.info("Trạng thái đã được cập nhật thành 'Đã xem'.");
        }
      }
      // ---------------------------------------------------------

      const payload = {
        ...editableData,
        status: nextStatus, // Sử dụng trạng thái mới
        attachmentFile: finalAttachmentName,
        detailedTestItems: editableData.detailedTestItems.map((item) => ({
          ...item,
          value: parseFloat(String(item.value)) || 0,
        })),
      };
      let updatedResult: TestResult;

      if (userRole === "doctor" && editableData.status === "COMPLETED") {
        // API review chỉ cần generalConclusion
        const reviewPayload = {
          generalConclusion: payload.generalConclusion,
        };
        updatedResult = await reviewTestResult(editableData.id, reviewPayload);
      }
      // Trường hợp 2: Các trường hợp còn lại là "cập nhật"
      // (Nhân viên cập nhật, hoặc bác sĩ tự nhập kết quả)
      else {
        updatedResult = await updateTestResult(editableData.id, payload);
      }

      setTestResult(updatedResult);
      setEditableData(JSON.parse(JSON.stringify(updatedResult)));
      setNewFile(null);
      setIsEditing(false);

      router.back();

    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error("Error updating test result:", err.message);
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Hàm hủy chỉnh sửa
  const handleCancel = () => {
    setEditableData(JSON.parse(JSON.stringify(testResult)));
    setNewFile(null); // Reset file mới khi hủy
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center min-h-screen">Đang tải dữ liệu...</div>
    );
  }

  if (!testResult || !editableData) {
    return (
      <div className="p-8 text-center min-h-screen">
        Không tìm thấy kết quả.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
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

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-8">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-sky-700 flex items-center gap-3">
              <FaStethoscope />
              Chi tiết kết quả xét nghiệm
            </h1>
            {(userRole === "staff" ||
              (userRole === "doctor" && testResult.status === "COMPLETED")) && (
              <StaffOrDoctorOnly userRole={userRole}>
                {}
                {!isEditing ? (
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={<FaEdit />}
                  >
                    {userRole === "doctor" ? "Cập nhật" : "Thêm kết quả"}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={confirmAndUpdate}
                      icon={<MdOutlineSaveAlt />}
                      isLoading={isUpdating}
                    >
                      Lưu
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCancel}
                      icon={<MdOutlineCancel />}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </StaffOrDoctorOnly>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-base">
            <p className="text-slate-600">
              <strong className="font-semibold text-slate-800">
                Loại xét nghiệm:
              </strong>{" "}
              {translateTestType(testResult.testType)}
            </p>
            <p className="text-slate-600">
              <strong className="font-semibold text-slate-800">
                Ngày thực hiện:
              </strong>{" "}
              {new Date(testResult.testTime).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3 text-slate-800">
              Kết luận chung
            </h2>
            {isEditing && userRole === "doctor" ? (
              <textarea
                name="generalConclusion"
                value={editableData.generalConclusion}
                onChange={handleInputChange}
                className="w-full p-2 border min-h-10
                border-gray-300 outline-none
                rounded-md text-slate-700"
                rows={4}
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {testResult.generalConclusion}
              </p>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Chỉ số chi tiết
            </h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm text-left table-fixed">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 font-semibold text-slate-700 w-1/5 border-r border-gray-200">
                      Tên chỉ số
                    </th>
                    <th className="p-3 font-semibold text-slate-700 w-1/5 border-r border-gray-200">
                      Giá trị
                    </th>
                    <th className="p-3 font-semibold text-slate-700 w-1/5 border-r border-gray-200">
                      Đơn vị
                    </th>
                    <th className="p-3 font-semibold text-slate-700 w-1/5 border-r border-gray-200">
                      Khoảng tham chiếu
                    </th>
                    <th className="p-3 font-semibold text-slate-700 w-1/5">
                      Ghi chú
                    </th>
                    {isEditing && <th className="p-3 w-[50px]"></th>}
                  </tr>
                </thead>
                <tbody>
                  {editableData.detailedTestItems.length === 0 && isEditing && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-gray-500 italic"
                      >
                        Chưa có chỉ số nào. Bấm Thêm chỉ số để bắt đầu.
                      </td>
                    </tr>
                  )}
                  {editableData.detailedTestItems.map((item, index) => (
                    <tr key={item.id || index} className="border-b">
                      {isEditing && userRole === "staff" ? (
                        <>
                          <td className="p-1 border-r">
                            <input
                              name="itemName"
                              value={item.itemName}
                              onChange={(e) => handleDetailChange(index, e)}
                              className="w-full p-2 text-slate-800 outline-none"
                            />
                          </td>
                          <td className="p-1 border-r">
                            <input
                              type="text"
                              name="value"
                              value={item.value}
                              onChange={(e) => handleDetailChange(index, e)}
                              className="w-full p-2 text-slate-700 outline-none"
                            />
                          </td>
                          <td className="p-1 border-r">
                            <input
                              name="unit"
                              value={item.unit}
                              onChange={(e) => handleDetailChange(index, e)}
                              className="w-full p-2 text-slate-700 outline-none"
                            />
                          </td>
                          <td className="p-1 border-r">
                            <input
                              name="referenceRange"
                              value={item.referenceRange}
                              onChange={(e) => handleDetailChange(index, e)}
                              className="w-full p-2 text-slate-700 outline-none"
                            />
                          </td>
                          <td className="p-1">
                            <textarea
                              name="notes"
                              value={item.notes || ""}
                              onChange={(e) => handleDetailChange(index, e)}
                              className="w-full p-2 text-slate-700 outline-none border-none min-h-20 resize-y"
                              rows={1}
                            />
                          </td>
                          <td className="p-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 duration-300
                            hover:text-red-700 p-2 rounded-full 
                            hover:bg-red-50 cursor-pointer"
                              title="Xóa chỉ số"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 font-medium text-slate-800 border-r border-gray-200">
                            {item.itemName}
                          </td>
                          <td className="p-3 text-slate-700 border-r border-gray-200">
                            {item.value}
                          </td>
                          <td className="p-3 text-slate-700 border-r border-gray-200">
                            {item.unit}
                          </td>
                          <td className="p-3 text-slate-700 border-r border-gray-200">
                            {item.referenceRange}
                          </td>
                          <td className="p-3 text-slate-700">
                            {item.notes || "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 12. Thêm nút "Thêm chỉ số" chỉ khi isEditing */}
            {isEditing && userRole === "staff" && (
              <div className="mt-4">
                <Button
                  onClick={addItem}
                  icon={<FaPlus />}
                  size="sm"
                  variant="secondary"
                >
                  Thêm chỉ số
                </Button>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            {" "}
            <h2 className="text-xl font-semibold mb-3 text-slate-800">
              Tệp đính kèm{" "}
            </h2>{" "}
            {isEditing && userRole === "staff" ? (
              // --- Chế độ CHỈNH SỬA ---
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Tệp hiện tại:{" "}
                  {editableData.attachmentFile ? (
                    // Biến nó thành link để xem file hiện tại
                    <a
                      href={`${STORAGE_BASE_URL}/${folderName}/${editableData.attachmentFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sky-600 hover:underline"
                    >
                      Xem tệp hiện tại ({editableData.attachmentFile})
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">Không có</span>
                  )}
                </p>
                <label
                  htmlFor="file_input"
                  className="cursor-pointer bg-white border border-gray-300 text-gray-700 duration-300 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 w-fit"
                >
                  <FaFileUpload />
                  {newFile ? "Thay đổi tệp" : "Tải lên tệp mới"}
                </label>
                <input
                  className="hidden"
                  id="file_input"
                  type="file"
                  onChange={handleFileChange}
                />
                {newFile && (
                  <span className="text-sm text-green-600 font-medium">
                    Đã chọn: {newFile.name}
                  </span>
                )}
              </div>
            ) : // --- Chế độ XEM ---
            testResult.attachmentFile ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline break-all"
              >
                Xem file đính kèm{" "}
              </a>
            ) : (
              <p className="text-slate-700">Không có tệp đính kèm.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultDetailPage;
