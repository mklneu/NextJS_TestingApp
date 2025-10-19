import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import InputBar from "../Input";
import { getDoctorById, updateDoctor } from "@/services/DoctorServices"; // 1. Import API services

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void;
  doctorId: number;
  setDoctorId: (value: number | null) => void;
}

// 2. Sử dụng một state object để quản lý dữ liệu
const initialDoctorState: Partial<Doctor> = {
  fullName: "",
  specialty: "",
  email: "",
  username: "",
  dob: "",
  phoneNumber: "",
  address: "",
  price: 0,
  experienceYears: 0,
  gender: "MALE",
  // status: "ACTIVE",
  hospital: { id: 0 },
};

// 1. Định nghĩa map chuyên khoa
const specialtyMap: Record<string, string> = {
  CARDIOLOGY: "Tim mạch",
  DERMATOLOGY: "Da liễu",
  ENDOCRINOLOGY: "Nội tiết",
  GASTROENTEROLOGY: "Tiêu hóa",
  GENERAL_PRACTICE: "Đa khoa",
  HEMATOLOGY: "Huyết học",
  NEUROLOGY: "Thần kinh",
  OBSTETRICS_GYNECOLOGY: "Sản phụ khoa",
  ONCOLOGY: "Ung thư học",
  OPHTHALMOLOGY: "Nhãn khoa",
  ORTHOPEDICS: "Chỉnh hình",
  OTOLARYNGOLOGY: "Tai mũi họng",
  PEDIATRICS: "Nhi khoa",
  PSYCHIATRY: "Tâm thần học",
  PULMONOLOGY: "Phổi",
  RADIOLOGY: "X quang",
  UROLOGY: "Tiết niệu",
};

// 2. Tạo danh sách options động từ map
const specializationOptions = Object.entries(specialtyMap).map(
  ([value, label]) => ({
    label,
    value,
  })
);

const UpdateDoctorModal = (props: IUpdateModalProps) => {
  const { show, setShow, onUpdate, doctorId, setDoctorId } = props;

  const [doctorData, setDoctorData] =
    useState<Partial<Doctor>>(initialDoctorState);
  const [loading, setLoading] = useState(false);

  // 3. Xóa mảng options cũ đã được hardcode
  // const specializationOptions = [ ... ];

  useEffect(() => {
    // Fetch doctor details if doctorId is provided

    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        const data = await getDoctorById(doctorId);
        setDoctorData(data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
        toast.error("Không thể lấy thông tin bác sĩ");
        // handleClose(); // Đóng modal nếu có lỗi
        setDoctorId(null);
        setShow(false);
        setDoctorData(initialDoctorState); // Reset form
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && show) {
      fetchDoctorDetails();
    }
  }, [doctorId, show, setDoctorId, setShow]);

  // 3. Hàm lấy dữ liệu từ API thật
  // const fetchDoctorDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await getDoctorById(doctorId);
  //     setDoctorData(data); // Cập nhật state với dữ liệu từ API
  //   } catch (error) {
  //     console.error("Lỗi khi lấy thông tin bác sĩ:", error);
  //     toast.error("Không thể lấy thông tin bác sĩ");
  //     handleClose(); // Đóng modal nếu có lỗi
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Sửa lại kiểu dữ liệu của 'e' để bao gồm cả HTMLTextAreaElement
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setDoctorId(null);
    setShow(false);
    setDoctorData(initialDoctorState); // Reset form
  };

  // 4. Hàm cập nhật dữ liệu bằng API thật
  const handleUpdate = async () => {
    if (
      !doctorData.fullName ||
      !doctorData.email ||
      !doctorData.specialty // Sửa lại cho đúng với state
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      await updateDoctor(doctorId, doctorData);
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
            w-196 max-w-2xl"
          >
            {/* ... Header ... */}
            <h1 className="px-5 py-4 text-2xl font-semibold">
              Cập nhật thông tin bác sĩ{" "}
              <span className="text-gray-600 font-bold text-sm">
                ID: {doctorId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />

            {loading && <p className="text-center">Đang tải dữ liệu...</p>}

            {!loading && (
              <>
                {/* 5. Cập nhật các InputBar để dùng state object */}
                <InputBar
                  label="Họ và tên"
                  value={doctorData.fullName || ""}
                  placeholder="Nhập họ tên bác sĩ"
                  onChange={handleInputChange}
                />

                <InputBar
                  type="select"
                  label="Chuyên khoa"
                  value={doctorData.specialty || ""}
                  placeholder="Chọn chuyên khoa"
                  onChange={handleInputChange}
                  options={specializationOptions} // Sử dụng options mới
                />

                <InputBar
                  label="Email"
                  disabled
                  type="email"
                  value={doctorData.email || ""}
                  placeholder="Nhập email"
                  onChange={handleInputChange}
                />

                <InputBar
                  label="Số điện thoại"
                  value={doctorData.phoneNumber || ""}
                  placeholder="Nhập số điện thoại"
                  onChange={handleInputChange}
                />

                <InputBar
                  label="Số năm kinh nghiệm"
                  value={doctorData.experienceYears?.toString() || "0"}
                  placeholder="Nhập số năm kinh nghiệm"
                  onChange={handleInputChange}
                />

                <InputBar
                  type="select"
                  label="Giới tính"
                  value={doctorData.gender || ""}
                  placeholder="Chọn giới tính"
                  onChange={handleInputChange}
                  options={[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" },
                  ]}
                />

                {/* <InputBar
                  type="select"
                  label="Trạng thái"
                  value={doctorData.status || ""}
                  placeholder="Chọn trạng thái"
                  onChange={handleInputChange}
                  options={[
                    { label: "Đang hoạt động", value: "ACTIVE" },
                    { label: "Tạm ngưng", value: "INACTIVE" },
                  ]}
                /> */}

                <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
                  <Button variant="secondary" size="md" onClick={handleClose}>
                    Hủy
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleUpdate}
                    // disabled={loading}
                  >
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
