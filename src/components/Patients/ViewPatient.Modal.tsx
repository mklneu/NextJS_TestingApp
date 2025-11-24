import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import { FaUserCircle, FaNotesMedical, FaPhoneAlt } from "react-icons/fa";
// Đảm bảo interface PatientProfile trong service đã được update đủ các trường nhé
import { getPatientById, PatientProfile } from "@/services/PatientServices";
import { formatDateToDMY } from "@/services/OtherServices";

interface IViewPatientModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: number | null;
  setUserId: (value: number | null) => void;
}

// Helper format nhóm máu cho đẹp
const formatBloodType = (type: string | undefined) => {
  if (!type) return "Chưa cập nhật";
  const map: Record<string, string> = {
    A_POSITIVE: "A Rh+",
    A_NEGATIVE: "A Rh-",
    B_POSITIVE: "B Rh+",
    B_NEGATIVE: "B Rh-",
    AB_POSITIVE: "AB Rh+",
    AB_NEGATIVE: "AB Rh-",
    O_POSITIVE: "O Rh+",
    O_NEGATIVE: "O Rh-",
  };
  return map[type] || type;
};

const ViewPatientModal = (props: IViewPatientModalProps) => {
  const { show, setShow, userId, setUserId } = props;
  const [patientData, setPatientData] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getPatientById(userId);
        setPatientData(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
        toast.error("Không thể lấy thông tin chi tiết");
        setShow(false);
        setUserId(null);
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };

    if (show && userId) {
      fetchPatientDetails();
    }
  }, [userId, show, setShow, setUserId]);

  const handleClose = () => {
    setShow(false);
    setUserId(null);
    setPatientData(null);
  };

  const InfoRow = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`flex flex-col sm:flex-row border-b border-gray-100 py-3 last:border-0 ${className}`}
    >
      <span className="text-gray-500 font-medium w-full sm:w-1/3 flex-shrink-0">
        {label}:
      </span>
      <span className="text-gray-800 font-semibold w-full sm:w-2/3 break-words">
        {value || <span className="text-gray-400 italic">Chưa cập nhật</span>}
      </span>
    </div>
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaUserCircle /> Hồ sơ chi tiết bệnh nhân
          </h2>
          <Button onClick={handleClose} variant="white">
            Đóng
          </Button>
        </div>

        {/* Body - Có thanh cuộn */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Đang tải thông tin...</p>
            </div>
          ) : patientData ? (
            <div className="space-y-6">
              {/* Header Profile Info */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-blue-200 shadow-sm">
                    {patientData.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white ${
                      patientData.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    title={
                      patientData.status === "ACTIVE"
                        ? "Đang hoạt động"
                        : "Vô hiệu hóa"
                    }
                  ></span>
                </div>
                <div className="flex-grow text-center md:text-left space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {patientData.fullName}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    @{patientData.username}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-600 shadow-sm">
                      ID: #{patientData.profileId}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        patientData.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {patientData.status === "ACTIVE"
                        ? "Hoạt động"
                        : "Vô hiệu hóa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cột Trái: Thông tin cá nhân */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
                    <FaUserCircle className="text-blue-500" />
                    Thông tin cá nhân
                  </div>
                  <div className="p-4 pt-0">
                    <InfoRow label="Email" value={patientData.email} />
                    <InfoRow
                      label="Số điện thoại"
                      value={patientData.phoneNumber}
                    />
                    <InfoRow
                      label="CCCD/CMND"
                      value={patientData.citizenId} // MỚI
                    />
                    <InfoRow
                      label="Ngày sinh"
                      value={
                        patientData.dob
                          ? formatDateToDMY(patientData.dob)
                          : undefined
                      }
                    />
                    <InfoRow
                      label="Giới tính"
                      value={
                        patientData.gender === "MALE"
                          ? "Nam"
                          : patientData.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"
                      }
                    />
                    <InfoRow label="Địa chỉ" value={patientData.address} />
                    
                  </div>
                </div>

                {/* Cột Phải: Thông tin Y tế & Khẩn cấp */}
                <div className="space-y-6">
                  {/* Hồ sơ y tế */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="bg-green-50 px-4 py-3 border-b border-green-100 font-bold text-green-800 flex items-center gap-2">
                      <FaNotesMedical className="text-green-600" />
                      Thông tin y tế
                    </div>
                    <div className="p-4 pt-0">
                      <InfoRow
                        label="Mã BHYT"
                        value={patientData.insuranceId} // MỚI
                      />
                      <InfoRow
                        label="Nhóm máu"
                        value={
                          <span className="text-red-600 font-bold">
                            {formatBloodType(patientData.bloodType)}
                          </span>
                        } // MỚI
                      />
                      <div className="py-3">
                        <span className="text-gray-500 font-medium block mb-1">
                          Tiền sử bệnh án:
                        </span>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700 text-sm min-h-[60px]">
                          {patientData.medicalHistorySummary ||
                            "Không có ghi nhận."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liên hệ khẩn cấp */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="bg-red-50 px-4 py-3 border-b border-red-100 font-bold text-red-800 flex items-center gap-2">
                      <FaPhoneAlt className="text-red-600" />
                      Liên hệ khẩn cấp
                    </div>
                    <div className="p-4 pt-0">
                      <InfoRow
                        label="Người liên hệ"
                        value={patientData.emergencyContactName} // MỚI
                      />
                      <InfoRow
                        label="Số điện thoại"
                        value={
                          patientData.emergencyContactPhone ? (
                            <a
                              href={`tel:${patientData.emergencyContactPhone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {patientData.emergencyContactPhone}
                            </a>
                          ) : undefined
                        } // MỚI
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500 py-10">
              Không tìm thấy dữ liệu bệnh nhân.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;