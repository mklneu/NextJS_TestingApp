"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { createAppointment } from "@/services/AppointmentServices";
import { getAllDoctors } from "@/services/DoctorServices";

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
    patientId: user?.id || "",
    doctorId: "",
    appointmentDate: "",
    patientNote: "",
    doctorNote: "",
    clinicRoom: "",
    appointmentType: "KHAM_TONG_QUAT",
  });
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<{ id: number; fullName: string }[]>(
    []
  );
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const data: { data: { id: number; fullName: string }[] } =
          await getAllDoctors(1, 1000);
        setDoctors(
          Array.isArray(data?.data)
            ? data.data.map((d) => ({
                id: d.id,
                fullName: d.fullName,
              }))
            : []
        );
        console.log("Fetched doctors:", data);
      } catch {
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Phân quyền: chỉ user và admin mới vào được (dùng useEffect để redirect)
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    if (!isLoggedIn || !(userRole === "user" || userRole === "admin")) {
      setIsRedirecting(true);
      router.replace("/");
    }
  }, [isLoggedIn, userRole, router]);
  if (isRedirecting) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        patient: { id: Number(form.patientId) },
        doctor: { id: Number(form.doctorId) },
        appointmentDate: form.appointmentDate,
        patientNote: form.patientNote,
        doctorNote: form.doctorNote,
        clinicRoom: form.clinicRoom,
        appointmentType: form.appointmentType,
        notificationSent: false,
      };
      await createAppointment(body);
      toast.success("Đặt lịch thành công!");
      router.push("/");
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 mt-10 border border-blue-100 animate-fadeIn">
      <h1 className="text-3xl font-bold 
      mb-8 text-blue-700 flex items-center gap-2">
        Đặt lịch khám
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Bệnh nhân
          </label>
          <input
            type="text"
            name="patientId"
            value={form.patientId}
            disabled
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-semibold opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Bác sĩ <span className="text-red-500">*</span>
          </label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
            disabled={loadingDoctors}
          >
            <option value="" disabled>
              {loadingDoctors
                ? "Đang tải danh sách bác sĩ..."
                : "-- Chọn bác sĩ --"}
            </option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Ngày giờ khám <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Chọn ngày giờ khám"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Phòng khám <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="clinicRoom"
            value={form.clinicRoom}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập phòng khám (VD: Phòng 101)"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Loại khám
          </label>
          <select
            name="appointmentType"
            value={form.appointmentType}
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          >
            {appointmentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Ghi chú bệnh nhân
          </label>
          <textarea
            name="patientNote"
            value={form.patientNote}
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px]"
            placeholder="Nhập ghi chú cho bác sĩ (nếu có)"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Ghi chú bác sĩ
          </label>
          <textarea
            name="doctorNote"
            value={form.doctorNote}
            onChange={handleChange}
            className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px]"
            placeholder="Ghi chú nội bộ cho bác sĩ (nếu cần)"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl mt-6 shadow-lg transition-all duration-200 text-lg tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Đang đặt lịch...
            </span>
          ) : (
            <>Đặt lịch khám</>
          )}
        </button>
      </form>
    </div>
  );
}
