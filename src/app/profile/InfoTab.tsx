import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserById, updateUser } from "@/services/UserServices";
import UpdateInfoModal from "@/components/Users/UpdateInfo.Modal";
import {
  FaUser,
  FaBirthdayCake,
  FaUserTag,
  FaEnvelope,
  FaTransgender,
  FaMapMarkerAlt,
} from "react-icons/fa";

const InfoTab = () => {
  const { userRole, userId, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  // Update user info handler
  const handleUpdateInfo = async (data: Partial<User>) => {
    if (!user) return;
    // Compose all required arguments for updateUser
    const updated = await updateUser(
      user.id,
      user.username,
      data.fullName ?? user.fullName,
      data.gender ?? user.gender,
      data.address ?? user.address,
      data.dob ?? user.dob,
      user.company ? { id: user.company.id } : { id: 0 },
      user.role ? { id: user.role.id } : { id: 0 }
    );
    setUser(updated);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const res = await getUserById(userId);
          setUser(res);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, setUser]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải thông tin...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <>
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : user.username.charAt(0).toUpperCase()}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg font-medium shadow hover:bg-blue-700 duration-200 text-sm"
              onClick={() => setShowEdit(true)}
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>
          {/* Info */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-extrabold mb-4 text-blue-700 flex items-center gap-2">
              Hồ sơ cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaUser className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Họ và tên</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.fullName}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaBirthdayCake className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Ngày sinh</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString("vi-VN")
                      : "-"}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaUserTag className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Tên đăng nhập</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.username}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaEnvelope className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Email</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaTransgender className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Giới tính</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.gender === "MALE"
                      ? "Nam"
                      : user.gender === "FEMALE"
                      ? "Nữ"
                      : "Khác"}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3">
                <FaUserTag className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-gray-500 text-xs">Vai trò</div>
                  <div className="font-semibold text-lg text-gray-600">
                    {user.role?.name || userRole}
                  </div>
                </div>
              </div>
              {user.address && (
                <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3 md:col-span-2">
                  <FaMapMarkerAlt className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="text-gray-500 text-xs">Địa chỉ</div>
                    <div className="font-semibold text-lg text-gray-600">
                      {user.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UpdateInfoModal
        show={showEdit}
        setShow={setShowEdit}
        user={user}
        onUpdate={handleUpdateInfo}
      />
    </>
  );
};

export default InfoTab;
