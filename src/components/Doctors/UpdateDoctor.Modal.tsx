import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import InputBar from "../Input";

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void; // Callback function to handle submission
  doctorId: number; // Doctor ID for updating
  setDoctorId: (value: number | null) => void; // Setter for doctorId
}

const UpdateDoctorModal = (props: IUpdateModalProps) => {
  const { show, setShow, onUpdate, doctorId, setDoctorId } = props;

  // Form states
  const [name, setName] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [experience, setExperience] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [status, setStatus] = useState<string>("ACTIVE");

  // Specializations options
  const specializationOptions = [
    { label: "Nội khoa", value: "Nội khoa" },
    { label: "Ngoại khoa", value: "Ngoại khoa" },
    { label: "Sản khoa", value: "Sản khoa" },
    { label: "Nhi khoa", value: "Nhi khoa" },
    { label: "Tim mạch", value: "Tim mạch" },
    { label: "Thần kinh", value: "Thần kinh" },
    { label: "Da liễu", value: "Da liễu" },
    { label: "Mắt", value: "Mắt" },
  ];

  useEffect(() => {
    // Fetch doctor details if doctorId is provided
    if (doctorId && show) {
      fetchDoctorDetails();
    }
  }, [doctorId, show]);

  const fetchDoctorDetails = async () => {
    try {
      // Mô phỏng API call - trong thực tế, bạn sẽ gọi API thực sự
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Dữ liệu mẫu - trong ứng dụng thực, bạn sẽ lấy từ API
      setName(`BS. Nguyễn Văn A${doctorId}`);
      setSpecialization(
        specializationOptions[doctorId % specializationOptions.length].value
      );
      setEmail(`doctor${doctorId}@smarthealth.com`);
      setPhone(`098765432${doctorId % 10}`);
      setExperience(5 + (doctorId % 15));
      setGender(doctorId % 3 === 0 ? "FEMALE" : "MALE");
      setStatus(doctorId % 5 === 0 ? "INACTIVE" : "ACTIVE");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      toast.error("Không thể lấy thông tin bác sĩ");
    }
  };

  const handleClose = () => {
    setDoctorId(null); // Reset doctorId when closing the modal
    setShow(false); // Close modal
  };

  const handleUpdate = async () => {
    if (!name || !email || !specialization || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // Mô phỏng API call - trong thực tế, bạn sẽ gọi API thực sự
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Cập nhật thông tin bác sĩ thành công!");
      onUpdate(); // Gọi callback để refresh danh sách
      setDoctorId(null); // Reset doctorId
      setShow(false); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin bác sĩ:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
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
            <h1 className="px-5 py-4 text-2xl font-semibold">
              Cập nhật thông tin bác sĩ{" "}
              <span className="text-gray-600 font-bold text-sm">
                ID: {doctorId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />

            <InputBar
              label="Họ và tên"
              value={name}
              placeholder="Nhập họ tên bác sĩ"
              onChange={(e) => setName(e.target.value)}
            />

            <InputBar
              type="select"
              label="Chuyên khoa"
              value={specialization}
              placeholder="Chọn chuyên khoa"
              onChange={(e) => setSpecialization(e.target.value)}
              options={specializationOptions}
            />

            <InputBar
              label="Email"
              type="email"
              value={email}
              placeholder="Nhập email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputBar
              label="Số điện thoại"
              value={phone}
              placeholder="Nhập số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
            />

            <InputBar
              label="Số năm kinh nghiệm"
              value={experience}
              placeholder="Nhập số năm kinh nghiệm"
              onChange={(e) => setExperience(Number(e.target.value))}
            />

            <InputBar
              type="select"
              label="Giới tính"
              value={gender}
              placeholder="Chọn giới tính"
              onChange={(e) => setGender(e.target.value)}
              options={[
                { label: "Nam", value: "MALE" },
                { label: "Nữ", value: "FEMALE" },
                { label: "Khác", value: "OTHER" },
              ]}
            />

            <InputBar
              type="select"
              label="Trạng thái"
              value={status}
              placeholder="Chọn trạng thái"
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: "Đang hoạt động", value: "ACTIVE" },
                { label: "Tạm ngưng", value: "INACTIVE" },
              ]}
            />

            <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
              <Button variant="secondary" size="md" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdate}>
                Cập nhật
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateDoctorModal;
