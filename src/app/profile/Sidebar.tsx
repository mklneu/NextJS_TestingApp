import { FaUser, FaCalendarAlt, FaFileMedicalAlt } from "react-icons/fa";

interface SidebarProps {
  activeTab: "info" | "appointments" | "medical";
  setActiveTab: (tab: "info" | "appointments" | "medical") => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-xl border border-blue-200 p-6 flex flex-row md:flex-col gap-4 md:gap-0 mb-6 md:mb-0">
      <button
        className={`flex items-center gap-3 px-4 py-3 
            rounded-lg font-semibold w-full cursor-pointer 
            mb-2 md:mb-4 focus:outline-none border transition-colors ${
              activeTab === "info"
                ? "text-blue-500 bg-blue-100 hover:bg-blue-200 border-blue-200"
                : "text-gray-500 hover:bg-blue-50 border-transparent"
            }`}
        onClick={() => setActiveTab("info")}
      >
        <FaUser className="w-5 h-5" />
        Thông tin cá nhân
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-3 
            rounded-lg font-semibold w-full cursor-pointer 
            mb-2 md:mb-4 focus:outline-none border transition-colors ${
              activeTab === "appointments"
                ? "text-blue-500 bg-blue-100 hover:bg-blue-200 border-blue-200"
                : "text-gray-500 hover:bg-blue-50 border-transparent"
            }`}
        onClick={() => setActiveTab("appointments")}
      >
        <FaCalendarAlt className="w-5 h-5" />
        Lịch hẹn
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-3 
            rounded-lg font-semibold w-full cursor-pointer 
            focus:outline-none border transition-colors ${
              activeTab === "medical"
                ? "text-blue-500 bg-blue-100 hover:bg-blue-200 border-blue-200"
                : "text-gray-500 hover:bg-blue-50 border-transparent"
            }`}
        onClick={() => setActiveTab("medical")}
      >
        <FaFileMedicalAlt className="w-5 h-5" />
        Hồ sơ bệnh án
      </button>
    </aside>
  );
};

export default Sidebar;
