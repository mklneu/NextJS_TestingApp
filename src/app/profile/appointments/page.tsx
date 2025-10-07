"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAppointmentByDoctorId } from "@/services/AppointmentServices";
import { FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { AxiosError } from "axios";
import {
  translateAppointmentStatus,
  translateAppointmentType,
} from "@/utils/translateEnums";
import { formatAppointmentDate, Pagination } from "@/services/OtherServices";

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
  const { user } = useAuth();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const appointmentsPerPage = 10; // Số lượng lịch hẹn mỗi trang

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentByDoctorId(
          user.id,
          currentPage,
          appointmentsPerPage
        );
        setAppointments(data?.data || []);
        setTotalPages(data?.meta?.pages || 1);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("❌ Error fetching appointments:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, currentPage, appointmentsPerPage]);

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
                Bệnh nhân
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Thời gian
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Phòng
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Loại khám
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Ghi chú BN
              </th>
              <th className="py-3 px-2 text-center font-semibold text-gray-700">
                Ghi chú BS
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
                    className="py-3 px-2 text-center 
                  font-medium flex items-center gap-2 max-w-[220px] 
                  whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <FaUserMd className="text-blue-400" />
                    <span className="truncate">{a.patient.fullName}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {formatAppointmentDate(a.appointmentDate)}
                  </td>
                  <td className="py-3 px-2 text-center">{a.clinicRoom}</td>
                  <td className="py-3 px-2 text-center">
                    {translateAppointmentType(a.appointmentType)}
                  </td>
                  <td
                    className="py-3 px-2 text-center text-gray-600 max-w-[180px] truncate"
                    title={a.patientNote}
                  >
                    {a.patientNote}
                  </td>
                  <td
                    className="py-3 px-2 text-center text-gray-600 max-w-[180px] truncate"
                    title={a.doctorNote}
                  >
                    {a.doctorNote}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold">
                    {translateAppointmentStatus(a.status) || "-"}
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
    </div>
  );
};

export default AppointmentsTab;
