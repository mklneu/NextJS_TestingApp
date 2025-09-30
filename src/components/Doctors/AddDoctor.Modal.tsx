import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import InputBar from "../Input";

interface IAddModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onSubmit: () => void; // Callback function to handle submission
}

const AddDoctorModal = (props: IAddModalProps) => {
  const { show, setShow, onSubmit } = props;

  // Form states
  const [name, setName] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [experience, setExperience] = useState<number>(0);
  const [gender, setGender] = useState<string>("");

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

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

  const resetForm = () => {
    setName("");
    setSpecialization("");
    setEmail("");
    setPhone("");
    setExperience(0);
    setGender("");
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleAdd = async () => {
    if (!name || !email || !specialization || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // Mô phỏng API call - trong thực tế, bạn sẽ gọi API thực sự
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Thêm bác sĩ thành công!");
      onSubmit(); // Gọi callback để refresh danh sách
      setShow(false); // Đóng modal
      resetForm(); // Reset form
    } catch (error) {
      console.error("Lỗi khi thêm bác sĩ:", error);
      toast.error("Có lỗi xảy ra khi thêm bác sĩ");
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
            w-196"
          >
            <h1 className="px-5 py-4 text-2xl">Thêm bác sĩ mới</h1>
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

            <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
              <Button variant="secondary" size="md" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="primary" size="md" onClick={handleAdd}>
                Thêm
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddDoctorModal;
