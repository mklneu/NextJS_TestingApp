"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAppointmentByDoctorId,
  getAppointmentByPatientId,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
} from "@/services/AppointmentServices";
import { FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { AxiosError } from "axios";
import {
  translateAppointmentStatus,
  translateAppointmentType,
} from "@/utils/translateEnums";
import {
  formatAppointmentDate,
  getStatusButtonClass,
  Pagination,
} from "@/services/OtherServices";
import Button from "@/components/Button";
import { toast } from "react-toastify";

// Fake loading skeleton
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-20" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-16" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-20" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-28" />
    </td>
    <td className="py-3 px-2">
      <div className="h-4 bg-gray-200 rounded w-16" />
    </td>
  </tr>
);

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

  const [sortByTime, setSortByTime] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const appointmentsPerPage = 10; // Số lượng lịch hẹn mỗi trang

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalNote, setModalNote] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        if (userRole === "doctor") {
          const data = await getAppointmentByDoctorId(
            user.id,
            sortByTime,
            currentPage,
            appointmentsPerPage
          );
          setAppointments(data?.data || []);
          setTotalPages(data?.meta?.pages || 1);
          console.log(">>>>>>> data", data);
        } else if (userRole === "admin" || userRole === "patient") {
          const data = await getAppointmentByPatientId(
            user.id,
            sortByTime,
            currentPage,
            appointmentsPerPage
          );
          setAppointments(data?.data || []);
          setTotalPages(data?.meta?.pages || 1);
        }
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("❌ Error fetching appointments:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, currentPage, appointmentsPerPage, userRole, sortByTime]);

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalNote(appointment.doctorNote || "");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleModalAction = async (
    action: "confirm" | "cancel" | "complete"
  ) => {
    if (!selectedAppointment) return;
    try {
      if (action === "confirm") {
        await confirmAppointment(selectedAppointment.id, modalNote);
        toast.success("✅ Xác nhận lịch hẹn thành công!");
      }
      if (action === "cancel") {
        await cancelAppointment(selectedAppointment.id, modalNote, "doctor");
        toast.success("✅ Đã huỷ lịch hẹn!");
      }
      if (action === "complete") {
        await completeAppointment(selectedAppointment.id, modalNote);
        toast.success("✅ Đã hoàn thành lịch hẹn!");
      }
      closeModal();
      // Gọi lại fetchAppointments() nếu muốn cập nhật lại danh sách
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 min-h-[400px] w-full max-w-none mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
        <FaCalendarAlt className="text-blue-500" /> Lịch hẹn của tôi
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full border rounded-lg">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="py-3 px-2 text-center font-semibold text-gray-700 w-20">
                No
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                {userRole == "doctor" ? "Bệnh nhân" : "Bác sĩ"}
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                <Button
                  onClick={() =>
                    setSortByTime(sortByTime === "asc" ? "desc" : "asc")
                  }
                  className="!bg-blue-50 !font-semibold !text-gray-700 !text-base
                hover:!bg-blue-100 !duration-300"
                >
                  {" "}
                  Thời gian khám
                </Button>
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Phòng
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Loại khám
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Ghi chú bệnh nhân
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Ghi chú bác sĩ
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : appointments && appointments.length > 0 ? (
              appointments.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-blue-50 transition text-gray-600 border-b border-b-gray-300"
                >
                  <td className="py-3 px-2 text-center font-mono text-xs text-gray-500">
                    {a.id}
                  </td>
                  <td
                    className="py-3 px-2 justify-center
                  font-medium flex items-center gap-2 max-w-[220px] 
                  whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <FaUserMd className="text-blue-400" />
                    <span className="truncate">
                      {a.patient ? a.patient.fullName : a.doctor.fullName}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {formatAppointmentDate(a.appointmentDate)}
                  </td>
                  <td className="py-3 px-2 text-center">{a.clinicRoom}</td>
                  <td className="py-3 px-2 text-center">
                    {translateAppointmentType(a.appointmentType)}
                  </td>
                  <td className="py-3 px-2 text-center text-gray-600 max-w-[180px] truncate">
                    {a.patientNote}
                  </td>
                  <td className="py-3 px-2 text-center text-gray-600 max-w-[180px] truncate">
                    {a.doctorNote}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold ">
                    {userRole === "doctor" ? (
                      <button
                        className={`px-3 py-1 rounded cursor-pointer
                          transition ${getStatusButtonClass(a.status)}`}
                        onClick={() => openModal(a)}
                      >
                        {translateAppointmentStatus(a.status) || "-"}
                      </button>
                    ) : (
                      <button
                        className={`px-3 py-1 rounded
                          transition ${getStatusButtonClass(a.status)}`}
                      >
                        {translateAppointmentStatus(a.status) || "-"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Modal for updating appointment status */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]"
          onClick={closeModal} // Click ra ngoài sẽ đóng modal
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Click trong modal không đóng
          >
            <button
              className="absolute top-2 right-2 cursor-pointer
               text-gray-400 hover:text-gray-600 text-xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">
              Cập nhật trạng thái lịch hẹn
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-4 
              min-h-[80px] resize-y text-gray-700 outline-none"
              placeholder="Nhập ghi chú bác sĩ"
              value={modalNote}
              onChange={(e) => setModalNote(e.target.value)}
            />
            <div className="flex justify-center gap-2">
              <button
                className="px-3 py-1 bg-green-100 cursor-pointer duration-300
                 text-green-700 rounded hover:bg-green-200 text-sm"
                onClick={() => handleModalAction("confirm")}
              >
                Chấp nhận
              </button>
              <button
                className="px-3 py-1 bg-red-100 cursor-pointer duration-300
                text-red-700 rounded hover:bg-red-200 text-sm"
                onClick={() => handleModalAction("cancel")}
              >
                Hủy lịch
              </button>
              <button
                className="px-3 py-1 bg-blue-100 cursor-pointer duration-300
                text-blue-700 rounded hover:bg-blue-200 text-sm"
                onClick={() => handleModalAction("complete")}
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
