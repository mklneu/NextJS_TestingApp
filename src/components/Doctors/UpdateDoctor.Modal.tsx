import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import InputBar from "../Input";
import {
  DoctorProfile,
  getDoctorById,
  updateDoctor,
} from "@/services/DoctorServices";
import { genderOptions } from "@/utils/map";
import {
  getSpecialtiesByHospitalId,
  Specialty,
} from "@/services/SpecialtyServices";
import { translateSpecialty } from "@/utils/translateEnums";

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void;
  doctorId: number;
  setDoctorId: (value: number | null) => void;
}

// Cập nhật state khởi tạo có thêm các trường mới
const initialDoctorState: Partial<DoctorProfile> = {
  fullName: "",
  email: "",
  username: "",
  dob: "",
  phoneNumber: "",
  address: "",
  licenseNumber: "", // Thêm trường này
  degree: "", // Thêm trường này
  experienceYears: 0,
  gender: "MALE",
  hospital: { id: 0, name: "" },
  specialty: { id: 0, specialtyName: "", description: "" },
};

const UpdateDoctorModal = (props: IUpdateModalProps) => {
  const { show, setShow, onUpdate, doctorId, setDoctorId } = props;

  const [doctorData, setDoctorData] = useState<Partial<DoctorProfile>>({}); // Dùng Partial để tránh lỗi init
  const [loading, setLoading] = useState(false);

  // 2. State lưu danh sách chuyên khoa lấy từ API
  const [dynamicSpecOptions, setDynamicSpecOptions] = useState<
    { label: string; value: number }[]
  >([]);

  // Effect 1: Lấy thông tin bác sĩ
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        const data = await getDoctorById(doctorId);
        setDoctorData(data);
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error("Không thể lấy thông tin bác sĩ");
        setDoctorId(null);
        setShow(false);
        setDoctorData(initialDoctorState);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && show) {
      fetchDoctorDetails();
    }
  }, [doctorId, show, setDoctorId, setShow]);

  // Effect 2: Lấy danh sách chuyên khoa dựa theo Hospital ID của bác sĩ
  useEffect(() => {
    const fetchSpecs = async () => {
      // Chỉ gọi khi đã có thông tin bệnh viện của bác sĩ
      if (doctorData.hospital?.id) {
        try {
          const res = await getSpecialtiesByHospitalId(
            String(doctorData.hospital.id)
          );
          // Map dữ liệu API về format { label, value } cho InputBar
          // Giả sử res trả về mảng: [{ id: 1, specialtyName: "Tim mạch" }, ...]
          const options = res.map((item: Specialty) => ({
            label: translateSpecialty(item.specialtyName),
            value: item.id, // Value là ID số
          }));
          setDynamicSpecOptions(options);
        } catch (error) {
          console.error("Lỗi lấy chuyên khoa:", error);
        }
      }
    };

    fetchSpecs();
  }, [doctorData.hospital?.id]); // Chạy lại khi hospitalId thay đổi

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "experienceYears") {
      setDoctorData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    // 3. Xử lý chọn chuyên khoa (Lưu ID vào state)
    if (name === "specialty") {
      setDoctorData((prev) => ({
        ...prev,
        specialty: {
          ...prev.specialty!,
          id: Number(value), // Quan trọng: Chuyển value thành số để lưu ID
        },
      }));
      return;
    }

    // Các trường text thông thường
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setDoctorId(null);
    setShow(false);
    setDoctorData(initialDoctorState);
  };

  // --- SỬA LẠI HÀM UPDATE ĐỂ TẠO BODY ĐÚNG CẤU TRÚC ---
  const handleUpdate = async () => {
    if (!doctorData.fullName || !doctorData.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Tạo payload theo đúng cấu trúc JSON yêu cầu
    const updateBody = {
      phoneNumber: doctorData.phoneNumber,
      fullName: doctorData.fullName,
      dob: doctorData.dob, // Định dạng YYYY-MM-DD từ input type="date"
      gender: doctorData.gender,
      address: doctorData.address,
      licenseNumber: doctorData.licenseNumber,
      experienceYears: doctorData.experienceYears,
      degree: doctorData.degree,
      hospitalId: doctorData.hospital?.id, // Lấy ID từ object hospital
      specialtyId: doctorData.specialty?.id, // Lấy ID từ object specialty
    };

    setLoading(true);
    try {
      // Gửi updateBody thay vì doctorData
      await updateDoctor(doctorId, updateBody);
      toast.success("Cập nhật thông tin bác sĩ thành công!");
      onUpdate();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin bác sĩ:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {show && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`flex justify-between bg-[rgba(0,0,0,0.4)] fixed
          items-center w-full min-h-screen mb-6 top-0 right-0 p-4 z-50`}
        >
          <div
            className="mx-auto bg-white text-black 
            rounded-lg shadow-2xl border border-gray-400
            w-196 max-w-2xl max-h-[90vh] overflow-y-auto" // Thêm scroll nếu form dài
          >
            <h1 className="px-5 py-4 text-2xl font-semibold sticky top-0 bg-white z-10 border-b">
              Cập nhật thông tin bác sĩ{" "}
              <span className="text-gray-600 font-bold text-sm">
                ID: {doctorId}
              </span>
            </h1>

            {loading && <p className="text-center py-4">Đang tải dữ liệu...</p>}

            {!loading && (
              <>
                <div className="w-11/12 mx-auto mt-8 space-y-3">
                  <div className="mb-6">
                    <InputBar
                      label="Họ và tên"
                      name="fullName"
                      value={doctorData.fullName || ""}
                      placeholder="Nhập họ tên bác sĩ"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputBar
                      label="Ngày sinh"
                      name="dob"
                      type="date"
                      value={doctorData.dob || ""}
                      onChange={handleInputChange}
                    />
                    <InputBar
                      type="select"
                      label="Giới tính"
                      name="gender"
                      value={doctorData.gender || ""}
                      placeholder="Chọn giới tính"
                      onChange={handleInputChange}
                      options={genderOptions}
                    />
                  </div>
                  <div className="mb-6">
                    <InputBar
                      label="Địa chỉ"
                      name="address"
                      value={doctorData.address || ""}
                      placeholder="Nhập địa chỉ"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputBar
                      label="Số điện thoại"
                      name="phoneNumber"
                      value={doctorData.phoneNumber || ""}
                      placeholder="Nhập số điện thoại"
                      onChange={handleInputChange}
                    />
                    <InputBar
                      label="Email"
                      disabled
                      type="email"
                      name="email"
                      value={doctorData.email || ""}
                      placeholder="Nhập email"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputBar
                      label="Số CCHN"
                      name="licenseNumber"
                      value={doctorData.licenseNumber || ""}
                      placeholder="Số chứng chỉ hành nghề"
                      onChange={handleInputChange}
                    />
                    <InputBar
                      label="Học vị / Bằng cấp"
                      name="degree"
                      value={doctorData.degree || ""}
                      placeholder="VD: Tiến sĩ, Thạc sĩ..."
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 4. Cập nhật InputBar Chuyên khoa */}
                    <InputBar
                      type="select"
                      label="Chuyên khoa"
                      name="specialty"
                      // Value lấy từ ID hiện tại của bác sĩ
                      value={doctorData.specialty?.id || ""}
                      placeholder="Chọn chuyên khoa"
                      onChange={handleInputChange}
                      // Dùng options động từ API
                      options={dynamicSpecOptions}
                    />

                    <InputBar
                      label="Số năm kinh nghiệm"
                      name="experienceYears"
                      value={doctorData.experienceYears?.toString() || "0"}
                      placeholder="Nhập số năm"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end mx-auto gap-2 mt-1 mb-6 w-11/12 pt-4 border-t">
                  <Button variant="secondary" onClick={handleClose}>
                    Hủy
                  </Button>
                  <Button variant="primary" onClick={handleUpdate}>
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateDoctorModal;
