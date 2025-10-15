"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserInjured, FaCalendarCheck, FaNotesMedical } from "react-icons/fa";
import { getAppointmentById } from "@/services/AppointmentServices";
import { AxiosError } from "axios";
import { getPatientById } from "@/services/PatientServices";
import { translateGender } from "@/utils/translateEnums";

const ExaminationDetailPage = () => {
  const params = useParams();
  const appointmentId = Number(params.appointmentId);

  const [patient, setPatient] = useState<resUser | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;
    // if (!patientId) return;
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const appResponse = await getAppointmentById(appointmentId);
        setAppointment(appResponse);
        const paResponse = await getPatientById(appResponse.patient.id);
        setPatient(paResponse);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("Error fetching appointment:", err.message);
        toast.error("Không thể tải thông tin lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải thông tin buổi khám...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Không tìm thấy thông tin lịch hẹn.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột thông tin bệnh nhân */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaUserInjured /> Thông tin bệnh nhân
          </h2>
          <div className="flex flex-col items-center text-center">
            {/* <img
              src={appointment.patient.avatar || "/default-avatar.png"}
              alt={appointment.patient.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4"
            /> */}
            <h3 className="text-lg font-semibold text-gray-800">
              {appointment.patient.fullName}
            </h3>
            <p className="text-gray-600">{patient?.email}</p>
            <div className="text-left w-full mt-4 space-y-2 text-gray-700">
              <p>
                <strong>Giới tính:</strong>{" "}
                {patient?.gender && translateGender(patient.gender)}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{" "}
                {patient?.dob
                  ? new Date(patient.dob).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Cột chính cho việc khám bệnh */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaCalendarCheck /> Thông tin buổi khám
          </h2>
          <p className="mb-4">
            {/* <strong>Lý do khám:</strong> {appointment.reason} */}
          </p>

          <div className="space-y-6">
            {/* Khu vực tạo kết quả xét nghiệm */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                <FaNotesMedical /> Chỉ định xét nghiệm
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tạo và quản lý các kết quả xét nghiệm cho bệnh nhân.
              </p>
              <button className="bg-blue-500 cursor-pointer duration-300
              text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                + Tạo kết quả xét nghiệm
              </button>
            </div>

            {/* Khu vực kê đơn thuốc */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800">
                Kê đơn thuốc
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tạo đơn thuốc điện tử cho bệnh nhân.
              </p>
              <button className="bg-green-500 cursor-pointer duration-300
              text-white px-4 py-2 rounded-lg hover:bg-green-600">
                + Tạo đơn thuốc
              </button>
            </div>
          </div>

          {/* Nút hoàn thành */}
          <div className="mt-8 text-right">
            <button className="bg-indigo-600 cursor-pointer
            text-white font-bold px-6 py-3 rounded-lg 
            hover:bg-indigo-700 duration-300">
              Hoàn thành buổi khám
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDetailPage;
