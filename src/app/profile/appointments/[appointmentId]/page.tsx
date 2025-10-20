"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaNotesMedical,
  FaFileMedicalAlt, // Icon mới
  FaChevronUp,
} from "react-icons/fa";
import {
  completeAppointment,
  CompleteAppointmentBody,
  getAppointmentById,
} from "@/services/AppointmentServices";
import { AxiosError } from "axios";
import { getPatientById } from "@/services/PatientServices";
import {
  translateAppointmentType,
  translateGender,
  translateTestType,
} from "@/utils/translateEnums";
import { FaPlus, FaPrescriptionBottle, FaUserDoctor } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
// 1. Import service và type mới
import {
  getTestResultsByAppointmentId,
  TestResult,
} from "@/services/TestResultServices";
import Button from "@/components/Button";
import {
  getPrescriptionsByAppointmentId,
  Prescription,
} from "@/services/PrescriptionServices";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorById } from "@/services/DoctorServices";
import DoctorOnly from "@/components/DoctorOnly";
import { formatAppointmentDate } from "@/services/OtherServices";

const ExaminationDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = Number(params.appointmentId);

  const { userRole } = useAuth();

  const [patient, setPatient] = useState<resUser | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  const otherPartyApp =
    userRole === "doctor" ? appointment?.patient : appointment?.doctor;
  const otherPartyUser = userRole === "doctor" ? patient : doctor;

  // 2. Thêm state để lưu danh sách kết quả xét nghiệm
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);

  const itemsToShowInitially = 1;

  const [loading, setLoading] = useState(true);

  // 2. State cho modal và ghi chú của bác sĩ
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [doctorNote, setDoctorNote] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Dùng Promise.all để gọi các API song song cho nhanh
        const [appResponse, resultsResponse, prescriptionResponse] =
          await Promise.all([
            getAppointmentById(appointmentId),
            getTestResultsByAppointmentId(appointmentId),
            getPrescriptionsByAppointmentId(appointmentId),
          ]);

        setAppointment(appResponse);
        setTestResults(resultsResponse); // 3. Lưu kết quả vào state
        setPrescriptions(prescriptionResponse);
        setDoctorNote(appResponse.doctorNote || ""); // Lấy ghi chú cũ nếu có

        // Gọi API lấy thông tin patient sau khi có appResponse
        const paResponse = await getPatientById(appResponse.patient.id);
        setPatient(paResponse);
        const drResponse = await getDoctorById(appResponse.doctor.id);
        setDoctor(drResponse);
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

  const handleConfirmComplete = async () => {
    setIsCompleting(true);
    try {
      const payload: CompleteAppointmentBody = {
        doctorNote: doctorNote,
        testResultIds: testResults.map((result) => result.id),
        prescriptionIds: prescriptions.map((p) => p.id),
      };

      await completeAppointment(appointmentId, payload);

      toast.success("Buổi khám đã được hoàn thành!");
      setIsCompleteModalOpen(false);
      router.back(); // Quay về trang trước
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error("Error completing appointment:", err.message);
      toast.error("Có lỗi xảy ra, không thể hoàn thành buổi khám.");
    } finally {
      setIsCompleting(false);
    }
  };

  const renderResultItem = (result: TestResult) => (
    <div
      key={result.id}
      className="flex items-center
       cursor-pointer -translate-y-1
      hover:shadow-inner hover:-translate-y-[2px]
      justify-between p-3 duration-300 
      bg-gray-50 rounded-lg border"
      onClick={() =>
        router.push(
          `/profile/appointments/${appointmentId}/testResult/${result.id}`
        )
      }
    >
      <div className="flex items-center gap-3">
        <FaFileMedicalAlt className="text-blue-500 text-lg" />
        <div>
          <p className="font-semibold text-gray-800">
            {translateTestType(result.testType) || "Xét nghiệm khác"}
          </p>
          <p className="text-xs text-gray-500">
            Ngày: {new Date(result.testTime).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrescriptionItem = (result: Prescription) => (
    <div
      key={result.id}
      className="flex items-center
       cursor-pointer -translate-y-1
      hover:shadow-inner hover:-translate-y-[2px]
      justify-between p-3 duration-300 
      bg-gray-50 rounded-lg border"
      onClick={() =>
        router.push(
          `/profile/appointments/${appointmentId}/prescription/${result.id}`
        )
      }
    >
      <div className="flex items-center gap-3">
        <FaFileMedicalAlt className="text-green-500" />
        <div>
          <p className="font-semibold text-gray-800">
            {translateTestType(result.diagnosis) || "Đơn thuốc khác"}
          </p>
          <p className="text-xs text-gray-500">
            Ngày:{" "}
            {new Date(result.prescriptionDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );

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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer
           text-gray-600 hover:text-gray-900
            font-semibold mb-6 transition-colors duration-200 focus:outline-none"
        >
          <IoIosArrowBack size={20} />
          {userRole !== "doctor" ? "Quay lại hồ sơ" : "Quay lại danh sách "}
        </button>
      </div>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cột thông tin bệnh nhân */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
            {userRole === "doctor" ? (
              <>
                <FaUserInjured /> Thông tin bệnh nhân
              </>
            ) : (
              <>
                <FaUserDoctor /> Thông tin bác sĩ
              </>
            )}
          </h2>
          <div className="flex flex-col items-center text-center">
            {/* <img
              src={appointment.patient.avatar || "/default-avatar.png"}
              alt={appointment.patient.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4"
            /> */}
            <h3 className="text-lg font-semibold text-gray-800">
              {otherPartyApp?.fullName}
            </h3>
            <p className="text-gray-600">{otherPartyUser?.email}</p>
            <div className="text-left w-full mt-4 space-y-2 text-gray-700">
              <p>
                <strong>Giới tính:</strong>{" "}
                {otherPartyUser?.gender &&
                  translateGender(otherPartyUser.gender)}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{" "}
                {otherPartyUser?.dob
                  ? new Date(otherPartyUser.dob).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>
          {appointment.doctorNote && (
            <div className="mt-6 border-t border-gray-300 pt-4">
              <h3 className="text-lg font-bold text-sky-700 mb-2 flex items-center gap-2">
                <FaNotesMedical /> Ghi chú của bác sĩ
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                - {appointment.doctorNote}
              </p>
            </div>
          )}
        </div>

        {/* Cột chính cho việc khám bệnh */}
        <div className="h-fit lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div>
            <div className="flex items-baseline text-xl font-bold text-sky-700 mb-1 gap-2">
              <FaCalendarCheck />
              <span> Thông tin buổi khám</span>{" "}
              <span className="text-sm font-medium text-gray-500">
                ({translateAppointmentType(appointment.appointmentType)})
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-300 my-2">
              <div className="text-gray-500 text-sm">
                Thời giam khám:{" "}
                {formatAppointmentDate(appointment.appointmentDate)}
              </div>
              <div className="text-gray-500 text-sm">
                Phòng khám: {appointment.clinicRoom}
              </div>
            </div>
          </div>

          <div className=" lg:space-x-3 lg:flex lg:flex-row w-full">
            {/* Khu vực tạo kết quả xét nghiệm */}
            <div className="mt-3 p-4 border rounded-lg space-y-3 lg:w-1/2 h-fit">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-600">
                <FaNotesMedical /> Chỉ định xét nghiệm
              </h3>

              {testResults.length > 0 ? (
                <div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">
                      Các kết quả đã tạo:
                    </p>
                    {/* Luôn hiển thị các mục ban đầu */}
                    {testResults
                      .slice(0, itemsToShowInitially)
                      .map(renderResultItem)}
                  </div>

                  {/* 1. Phần tử có thể đóng mở mượt mà */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      showAllResults
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-3 pt-3">
                        {/* Render các mục còn lại ở đây */}
                        {testResults
                          .slice(itemsToShowInitially)
                          .map(renderResultItem)}
                      </div>
                    </div>
                  </div>
                  {/* Nút điều khiển */}
                  {testResults.length > itemsToShowInitially && (
                    <Button
                      onClick={() => setShowAllResults(!showAllResults)}
                      className="w-full flex
                       items-center justify-center gap-2  
                      py-2 mt-4"
                      variant="white"
                    >
                      <div className="flex items-center gap-2">
                        {showAllResults
                          ? `Ẩn bớt `
                          : `Xem thêm ${
                              testResults.length - itemsToShowInitially
                            } kết quả`}
                        <FaChevronUp
                          className={`${
                            !showAllResults ? "rotate-180" : ""
                          } duration-500`}
                        />
                      </div>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-center text-gray-500 py-4">
                  Chưa có kết quả xét nghiệm nào được tạo cho buổi khám này.
                </p>
              )}
              {!["COMPLETED", "CANCELLED"].includes(appointment.status) && (
                <DoctorOnly userRole={userRole}>
                  <div className="pt-2">
                    <Button
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
                </DoctorOnly>
              )}
            </div>

            {/* Khu vực kê đơn thuốc */}
            <div className="mt-3 p-4 border rounded-lg space-y-3 lg:w-1/2 h-fit">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-600">
                <FaPrescriptionBottle />
                Kê đơn thuốc
              </h3>

              {prescriptions.length > 0 ? (
                <div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">
                      Các kết quả đã tạo:
                    </p>
                    {/* Luôn hiển thị các mục ban đầu */}
                    {prescriptions
                      .slice(0, itemsToShowInitially)
                      .map(renderPrescriptionItem)}
                  </div>

                  {/* 1. Phần tử có thể đóng mở mượt mà */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      showAllPrescriptions
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-3 pt-3">
                        {/* Render các mục còn lại ở đây */}
                        {prescriptions
                          .slice(itemsToShowInitially)
                          .map(renderPrescriptionItem)}
                      </div>
                    </div>
                  </div>
                  {/* Nút điều khiển */}
                  {prescriptions.length > itemsToShowInitially && (
                    <Button
                      onClick={() =>
                        setShowAllPrescriptions(!showAllPrescriptions)
                      }
                      className="w-full flex
                       items-center justify-center gap-2  
                      py-2 mt-4 hover:bg-blue-50"
                      variant="white"
                    >
                      <div className="flex items-center gap-2">
                        {showAllPrescriptions
                          ? `Ẩn bớt `
                          : `Xem thêm ${
                              prescriptions.length - itemsToShowInitially
                            } kết quả`}
                        <FaChevronUp
                          className={`${
                            !showAllPrescriptions ? "rotate-180" : ""
                          } transition-transform duration-500`}
                        />
                      </div>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-center text-gray-500 py-4">
                  Chưa có kết quả xét nghiệm nào được tạo cho buổi khám này.
                </p>
              )}
              {!["COMPLETED", "CANCELLED"].includes(appointment.status) && (
                <DoctorOnly userRole={userRole}>
                  <div className="pt-2">
                    <Button
                      onClick={() =>
                        router.push(
                          `/profile/appointments/${appointmentId}/prescription`
                        )
                      }
                      variant="green"
                      icon={<FaPlus />}
                    >
                      Tạo đơn thuốc mới
                    </Button>
                  </div>
                </DoctorOnly>
              )}
            </div>
          </div>
          {appointment.status === "COMPLETED" ? (
            <div className="flex mt-4 justify-end">
              <Button
                variant="green"
                translate={false}
                className="hover:-translate-x-[2px] 
                !cursor-default"
              >
                Buổi khám đã được hoàn thành
              </Button>
            </div>
          ) : appointment.status === "CANCELLED" ? (
            <div className="flex mt-4 justify-end">
              <Button
                variant="danger"
                translate={false}
                className="hover:-translate-x-[2px] 
                !cursor-default"
              >
                Buổi khám đã bị hủy
              </Button>
            </div>
          ) : (
            <DoctorOnly userRole={userRole}>
              <div className="flex mt-4 justify-end">
                <Button
                  variant="purple"
                  onClick={() => setIsCompleteModalOpen(true)}
                  translate={false}
                  className="hover:-translate-x-[2px]"
                >
                  Hoàn thành buổi khám
                </Button>
              </div>
            </DoctorOnly>
          )}
        </div>
      </div>
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Hoàn thành buổi khám
            </h2>
            <textarea
              className="w-full p-2 border outline-none
              border-gray-300 rounded-md text-slate-700 min-h-24"
              rows={4}
              placeholder="Nhập ghi chú của bác sĩ..."
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-5">
              <Button
                variant="secondary"
                onClick={() => setIsCompleteModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="purple"
                onClick={handleConfirmComplete}
                isLoading={isCompleting}
              >
                {isCompleting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationDetailPage;
