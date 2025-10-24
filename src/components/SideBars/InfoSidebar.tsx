import { FaUser, FaCalendarAlt, FaFileMedicalAlt } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: "info" | "appointments" | "testRult";
}

const InfoSidebar = ({ activeTab }: SidebarProps) => {
  const { userRole } = useAuth();

  return (
    <aside
      className="w-full md:w-64 bg-white
    rounded-2xl shadow-xl border border-blue-200 
    p-6 flex flex-row md:flex-col gap-4 md:gap-0 mb-6 md:mb-0 md:sticky md:top-20"
    >
      <Link
        href="/profile/info"
        className={`flex items-center gap-3 px-4 py-3 
            rounded-lg font-semibold w-full cursor-pointer 
            mb-2 md:mb-4 focus:outline-none duration-300 ${
              activeTab === "info"
                ? "text-blue-500 bg-blue-100 hover:bg-blue-200 "
                : "text-gray-500 hover:bg-blue-50 border-transparent"
            }`}
      >
        <FaUser className="w-5 h-5" />
        Thông tin cá nhân
      </Link>
      <Link
        href="/profile/appointments"
        className={`flex items-center gap-3 px-4 py-3 
            rounded-lg font-semibold w-full cursor-pointer 
             focus:outline-none duration-300 ${
               activeTab === "appointments"
                 ? "text-blue-500 bg-blue-100 hover:bg-blue-200 "
                 : "text-gray-500 hover:bg-blue-50 border-transparent"
             }`}
      >
        <FaCalendarAlt className="w-5 h-5" />
        Lịch hẹn
      </Link>
      {userRole !== "doctor" && (
        <Link
          href="/profile/testResult"
          className={`flex items-center gap-3 px-4 py-3 mt-2 md:mt-4
                rounded-lg font-semibold w-full cursor-pointer 
                focus:outline-none duration-300 ${
                  activeTab === "testRult"
                    ? "text-blue-500 bg-blue-100 hover:bg-blue-200 "
                    : "text-gray-500 hover:bg-blue-50 border-transparent"
                }`}
        >
          <FaFileMedicalAlt className="w-5 h-5" />
          Hồ sơ bệnh án
        </Link>
      )}
    </aside>
  );
};

export default InfoSidebar;
