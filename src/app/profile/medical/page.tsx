import { FaFileMedicalAlt } from "react-icons/fa";

const MedicalTab = () => {
  return (
    <div className="p-8 bg-white min-h-[400px] flex flex-col items-center justify-center text-center text-gray-500">
      <FaFileMedicalAlt className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">
        Tính năng đang phát triển
      </h3>
      <p className="mt-2 max-w-sm">
        Hồ sơ bệnh án của bạn sẽ sớm được hiển thị tại đây. Chúng tôi đang làm
        việc để mang đến cho bạn trải nghiệm tốt nhất.
      </p>
    </div>
  );
};

export default MedicalTab;
