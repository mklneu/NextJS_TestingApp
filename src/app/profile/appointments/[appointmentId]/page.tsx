"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaNotesMedical,
  FaFileMedicalAlt, // Icon mới
} from "react-icons/fa";
import { getAppointmentById } from "@/services/AppointmentServices";
import { AxiosError } from "axios";
import { getPatientById } from "@/services/PatientServices";
import { translateGender, translateTestType } from "@/utils/translateEnums";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
// 1. Import service và type mới
import {
  getTestResultsByAppointmentId,
  TestResult,
} from "@/services/TestResultServices";
import Button from "@/components/Button";

const ExaminationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = Number(params.appointmentId);

  const [patient, setPatient] = useState<resUser | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  // 2. Thêm state để lưu danh sách kết quả xét nghiệm
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Dùng Promise.all để gọi các API song song cho nhanh
        const [appResponse, resultsResponse] = await Promise.all([
          getAppointmentById(appointmentId),
          getTestResultsByAppointmentId(appointmentId),
        ]);

        setAppointment(appResponse);
        setTestResults(resultsResponse); // 3. Lưu kết quả vào state

        // Gọi API lấy thông tin patient sau khi có appResponse
        const paResponse = await getPatientById(appResponse.patient.id);
        setPatient(paResponse);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("Error fetching examination data:", err.message);
        toast.error("Không thể tải thông tin buổi khám.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
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
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer
           text-gray-600 hover:text-gray-900
            font-semibold mb-6 transition-colors duration-200 focus:outline-none"
        >
          <IoIosArrowBack size={20} />
          Quay lại danh sách chờ khám
        </button>
      </div>
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

          <div className="space-y-3">
            {/* Khu vực tạo kết quả xét nghiệm */}
            <div className="p-4 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                <FaNotesMedical /> Chỉ định xét nghiệm
              </h3>

              {/* 4. Hiển thị danh sách kết quả đã có */}
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    Các kết quả đã tạo:
                  </p>
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center hover:shadow-md cursor-pointer
                      justify-between p-3 duration-300
                      bg-gray-50 rounded-lg border"
                      onClick={() =>
                        router.push(
                          `/profile/appointments/${appointmentId}/testResult/${result.id}`
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <FaFileMedicalAlt className="text-blue-500" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {translateTestType(result.testType) ||
                              "Xét nghiệm khác"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ngày:{" "}
                            {new Date(result.testTime).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Chưa có kết quả xét nghiệm nào được tạo cho buổi khám này.
                </p>
              )}

              {/* Nút tạo mới */}
              <div className="pt-2">
                <Button
                  className="bg-blue-500 cursor-pointer duration-300
              text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  onClick={() =>
                    router.push(
                      `/profile/appointments/${appointmentId}/testResult`
                    )
                  }
                  icon={<FaPlus />}
                >
                  Tạo kết quả xét nghiệm mới
                </Button>
              </div>
            </div>

            {/* Khu vực kê đơn thuốc */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg text-gray-800">
                Kê đơn thuốc
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tạo đơn thuốc điện tử cho bệnh nhân.
              </p>
              <Button
                className="bg-green-500 cursor-pointer duration-300
              text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                onClick={() =>
                  router.push(
                    `/profile/appointments/${appointmentId}/prescription`
                  )
                }
                icon={<FaPlus />}
              >
                Tạo đơn thuốc mới
              </Button>
            </div>
          </div>

          {/* Nút hoàn thành */}
          <div className="flex mt-4 justify-end">
            <Button variant="purple">Hoàn thành buổi khám</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDetailPage;
