"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { createAppointment } from "@/services/AppointmentServices";
import { getDoctorsByHospitalId } from "@/services/DoctorServices";
import Button from "@/components/Button";
import { AxiosError } from "axios";
import { getAllHospitals } from "@/services/HospitalServices";
import InputBar from "@/components/Input";

const appointmentTypes = [
  { value: "KHAM_TONG_QUAT", label: "Khám tổng quát" },
  { value: "KHAM_CHUYEN_KHOA", label: "Khám chuyên khoa" },
  { value: "TAI_KHAM", label: "Tái khám" },
  { value: "TIEM_CHUNG", label: "Tiêm chủng" },
  { value: "KHAM_SUC_KHOE_DINH_KY", label: "Khám sức khỏe định kỳ" },
];

export default function BookingPage() {
  const router = useRouter();
  const { userRole, user, isLoggedIn } = useAuth();

  // State cho form (luôn khai báo trước mọi return)
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    patientNote: "",
    appointmentType: "KHAM_TONG_QUAT",
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<{ id: number; fullName: string }[]>(
    []
  );
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await getAllHospitals();
        setHospitals(res);
      } catch {
        toast.error("Không thể tải danh sách bệnh viện.");
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        setLoadingDoctors(true);
        // Reset danh sách bác sĩ cũ
        setDoctors([]);
        setForm((prev) => ({ ...prev, doctorId: "" }));
        try {
          const res = await getDoctorsByHospitalId(selectedHospital);
          setDoctors(res.data);
        } catch {
          toast.error("Không thể tải danh sách bác sĩ cho bệnh viện này.");
        } finally {
          setLoadingDoctors(false);
        }
      };
      fetchDoctors();
    }
  }, [selectedHospital]); // Chạy lại khi selectedHospital thay đổi

  const handleHospitalChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setSelectedHospital(e.target.value);
  };

  // Phân quyền: chỉ user và admin mới vào được (dùng useEffect để redirect)
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Sửa lại useEffect này
  useEffect(() => {
    // Chỉ thực hiện kiểm tra và chuyển hướng KHI userRole đã có giá trị (không còn là null nữa)
    // Điều này đảm bảo AuthProvider đã kiểm tra xong trạng thái đăng nhập.
    if (userRole !== null) {
      if (!isLoggedIn || !(userRole === "patient" || userRole === "admin")) {
        toast.error("Bạn không có quyền truy cập trang này."); // Thêm thông báo lỗi
        setIsRedirecting(true);
        router.replace("/");
      }
    }
  }, [isLoggedIn, userRole, router]); // Vẫn giữ dependencies như cũ

  // Thêm một trạng thái loading dựa trên userRole
  const authLoading = userRole === null && isLoggedIn === false; // Giả định ban đầu isLoggedIn là false

  // Nếu đang loading thông tin auth hoặc đang chuyển hướng, hiển thị loading
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang kiểm tra quyền truy cập...</p>
        {/* Hoặc một component Spinner đẹp hơn */}
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    console.log(
      "handleChange called for:",
      e.target.name,
      "with value:",
      e.target.value
    ); // Thêm dòng này
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.doctorId || !form.appointmentDate) {
      toast.error("Vui lòng chọn đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const isoDateString = new Date(form.appointmentDate).toISOString();
      const body = {
        patient: { id: user?.id },
        doctor: { id: Number(form.doctorId) },
        appointmentDate: isoDateString,
        patientNote: form.patientNote,
        appointmentType: form.appointmentType,
        notificationSent: true,
      };
      const res = await createAppointment(body);
      toast.success(res.message);
      router.push("/profile/appointments");
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error("❌ Error in booking appointment:", err);
      toast.error("Đặt lịch thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 flex  justify-center">
      <div
        className="max-w-4xl w-full mx-auto h-fit
      bg-white rounded-2xl shadow-xl p-8 md:p-12 
      border border-gray-100"
      >
        <h1 className="text-3xl font-bold mb-8 text-blue-700">
          Đặt lịch hẹn khám bệnh
        </h1>
        <form onSubmit={handleSubmit} className="">
          {/* Hàng đầu tiên: Bệnh nhân và Bệnh viện */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Bệnh nhân
              </label>
              <InputBar
                type="text"
                value={user?.fullName || ""}
                disabled
                className="w-full border-gray-200 border-1
                 rounded-lg px-4 py-3 bg-gray-100 outline-none
                  text-gray-500 font-medium"
              />
            </div>
            <div>
              <label
                htmlFor="hospital"
                className="block font-semibold mb-2 text-gray-700"
              >
                Chọn Bệnh viện <span className="text-red-500">*</span>
              </label>
              <InputBar
                type="select"
                value={selectedHospital}
                onChange={handleHospitalChange}
                className="w-full border-gray-300 border-1 
                 rounded-lg px-4 py-3 bg-white outline-none
                 text-gray-800 focus:border-blue-500
                  "
                options={hospitals.map((hospital) => ({
                  label: hospital.name, // Dùng hospital.name làm label hiển thị
                  value: hospital.id.toString(), // Dùng hospital.id làm giá trị thực tế
                }))}
                placeholder="Chọn bệnh viện"
              >
                {/* <option value="" disabled>
                  -- Vui lòng chọn bệnh viện --
                </option>
                {hospitals?.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))} */}
              </InputBar>
            </div>
          </div>

          {/* Các trường phụ thuộc */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              selectedHospital
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Chọn Bác sĩ */}
              <div>
                <label
                  htmlFor="doctorId"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Chọn Bác sĩ <span className="text-red-500">*</span>
                </label>
                <InputBar
                  type="select"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className="w-full border-gray-300 border-1
                  rounded-lg px-4 py-3 bg-white outline-none
                  text-gray-800 focus:border-blue-500 "
                  disabled={
                    loadingDoctors || !selectedHospital || doctors.length === 0
                  }
                  options={doctors.map((d) => ({
                    label: d.fullName,
                    value: d.id.toString(),
                  }))}
                  placeholder={
                    loadingDoctors
                      ? "Đang tải bác sĩ..."
                      : doctors.length > 0
                      ? "Chọn bác sĩ"
                      : "Không có bác sĩ tại bệnh viện này"
                  }
                />
                {/* <option value="" disabled>
                    {loadingDoctors
                      ? "Đang tải bác sĩ..."
                      : doctors.length > 0
                      ? "-- Chọn một bác sĩ --"
                      : "Không có bác sĩ tại bệnh viện này"}
                  </option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName}
                    </option>
                  ))} */}
              </div>

              {/* Loại hình khám */}
              <div>
                <label
                  htmlFor="appointmentType"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Loại hình khám
                </label>
                <InputBar
                  type="select"
                  name="appointmentType"
                  value={form.appointmentType}
                  onChange={handleChange}
                  className="w-full border-gray-300 border-1
                  rounded-lg px-4 py-3 bg-white outline-none
                  text-gray-800 focus:border-blue-500
                   "
                  options={appointmentTypes}
                  placeholder="Chọn loại hình khám"
                >
                  {/* {appointmentTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))} */}
                </InputBar>
              </div>

              {/* Ngày giờ khám */}
              <div className="md:col-span-2">
                <label
                  htmlFor="appointmentDate"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Chọn ngày giờ khám <span className="text-red-500">*</span>
                </label>
                <InputBar
                  type="datetime-local"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  className="w-full border-gray-300 border-1
                   rounded-lg px-4 py-3 text-gray-800 outline-none
                    focus:border-blue-500 !pr-5"
                />
              </div>
            </div>

            {/* Lý do khám */}
            <div className="">
              <label
                htmlFor="patientNote"
                className="block font-semibold mb-2 text-gray-700"
              >
                Triệu chứng hoặc lý do khám
              </label>
              <InputBar
                type="textarea"
                name="patientNote"
                value={form.patientNote}
                onChange={handleChange}
                rows={3}
                // className="w-full border-gray-300 border-1
                // rounded-lg px-4 py-3 text-gray-800 outline-none
                //  focus:border-blue-500 min-h-12"
                placeholder="Vui lòng mô tả ngắn gọn tình trạng của bạn (ví dụ: ho, sốt, đau đầu...)"
              />
            </div>
          </div>

          {/* Nút submit */}
          <div className="pt-4">
            <Button isLoading={loading} className="w-full" size="lg">
              Xác nhận đặt lịch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
