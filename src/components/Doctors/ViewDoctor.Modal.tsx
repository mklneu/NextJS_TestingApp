import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../Button";

interface IViewModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  doctorId: number; // Doctor ID for viewing
  setDoctorId: (value: number | null) => void; // Setter for doctorId
}

const ViewDoctorModal = (props: IViewModalProps) => {
  const { show, setShow, doctorId, setDoctorId } = props;

  // Doctor data state
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: 0,
    gender: "",
    status: "",
    certifications: [""],
    education: "",
    scheduleDays: [""],
    scheduleHours: "",
    about: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Mô phỏng API call - trong thực tế, bạn sẽ gọi API thực sự
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Dữ liệu mẫu - trong ứng dụng thực, bạn sẽ lấy từ API
        const specializations = [
          "Nội khoa",
          "Ngoại khoa",
          "Sản khoa",
          "Nhi khoa",
          "Tim mạch",
          "Thần kinh",
          "Da liễu",
          "Mắt",
        ];

        const certifications = [
          "Chứng chỉ hành nghề y khoa",
          "Thành viên Hiệp hội Y khoa Việt Nam",
          "Chứng nhận chuyên khoa sâu",
        ];

        const scheduleDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];

        setDoctor({
          name: `BS. Nguyễn Văn A${doctorId}`,
          specialization: specializations[doctorId % specializations.length],
          email: `doctor${doctorId}@smarthealth.com`,
          phone: `098765432${doctorId % 10}`,
          experience: 5 + (doctorId % 15),
          gender: doctorId % 3 === 0 ? "FEMALE" : "MALE",
          status: doctorId % 5 === 0 ? "INACTIVE" : "ACTIVE",
          certifications: certifications.slice(0, 1 + (doctorId % 3)),
          education: "Đại học Y Hà Nội",
          scheduleDays: scheduleDays.slice(0, 3 + (doctorId % 3)),
          scheduleHours: "8:00 - 17:00",
          about:
            "Là một bác sĩ có nhiều năm kinh nghiệm trong lĩnh vực y khoa, luôn tận tâm với nghề và mong muốn mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho bệnh nhân.",
          rating: 4 + (doctorId % 2) * 0.5,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
        toast.error("Không thể lấy thông tin bác sĩ");
      }
    };
    // Fetch doctor details if doctorId is provided
    if (doctorId && show) {
      fetchDoctorDetails();
    }
  }, [doctorId, show]);

  const handleClose = () => {
    setDoctorId(null); // Reset doctorId when closing the modal
    setShow(false); // Close modal
  };

  return (
    <>
      {show && (
        <div
          className={`flex justify-between bg-[rgba(0,0,0,0.4)] fixed
          items-center w-full min-h-screen mb-6 top-0 right-0 p-4 z-50`}
        >
          <div
            className="mx-auto bg-white text-black 
            rounded-lg shadow-2xl border border-gray-400
            w-full max-w-3xl"
          >
            <div className="px-5 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                Thông tin chi tiết bác sĩ
                <span className="text-gray-600 font-bold text-sm ml-2">
                  ID: {doctorId}
                </span>
              </h1>
              <Button size="sm" onClick={handleClose}>
                &times;
              </Button>
            </div>

            <hr className="mb-6 text-gray-200" />

            <div className="px-6">
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-6xl text-gray-500">
                      {doctor.name.charAt(4)}
                    </span>
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{doctor.name}</h2>
                    <p className="text-blue-600">{doctor.specialization}</p>
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(doctor.rating)
                              ? "text-yellow-400"
                              : i < doctor.rating
                              ? "text-yellow-200"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">
                        {doctor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 md:pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mb-2">{doctor.email}</p>

                      <h3 className="text-sm font-medium text-gray-500">
                        Điện thoại
                      </h3>
                      <p className="mb-2">{doctor.phone}</p>

                      <h3 className="text-sm font-medium text-gray-500">
                        Giới tính
                      </h3>
                      <p className="mb-2">
                        {doctor.gender === "MALE"
                          ? "Nam"
                          : doctor.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Kinh nghiệm
                      </h3>
                      <p className="mb-2">{doctor.experience} năm</p>

                      <h3 className="text-sm font-medium text-gray-500">
                        Trình độ học vấn
                      </h3>
                      <p className="mb-2">{doctor.education}</p>

                      <h3 className="text-sm font-medium text-gray-500">
                        Trạng thái
                      </h3>
                      <p
                        className={`mb-2 font-medium ${
                          doctor.status === "ACTIVE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {doctor.status === "ACTIVE"
                          ? "Đang hoạt động"
                          : "Tạm ngưng"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Chứng chỉ
                    </h3>
                    <ul className="list-disc pl-5 mb-4">
                      {doctor.certifications.map((cert, index) => (
                        <li key={index} className="text-sm">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Giới thiệu
                </h3>
                <p className="text-gray-700">{doctor.about}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Lịch làm việc
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {doctor.scheduleDays.map((day, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-blue-800">
                  Giờ làm việc: {doctor.scheduleHours}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
              <Button variant="secondary" size="md" onClick={handleClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewDoctorModal;
