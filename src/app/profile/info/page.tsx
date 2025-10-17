"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import UpdateInfoModal from "@/components/Users/UpdateInfo.Modal";
import {
  FaUser,
  FaBirthdayCake,
  FaUserTag,
  FaEnvelope,
  FaTransgender,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getPatientById, updatePatient } from "@/services/PatientServices";
import Button from "@/components/Button";

const InfoTab = () => {
  const { userRole, userId, user, setUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  // Update user info handler
  const handleUpdateInfo = async (data: Partial<reqUser>) => {
    if (!user) return;
    // Compose all required arguments for updateUser
    const updated = await updatePatient(
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
          const res = await getPatientById(userId);
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
    return <div className="text-center mt-10 min-h-screen">Đang tải thông tin...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500 min-h-screen">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white w-full max-w-6xl min-h-screen
      mx-auto p-6 md:p-10 rounded-2xl">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Hồ sơ cá nhân
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white text-6xl font-bold shadow-lg border-4 border-white">
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : user.username.charAt(0).toUpperCase()}
            </div>
            <Button
              className="mt-6"
              onClick={() => setShowEdit(true)}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
          {/* Info */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Họ và tên */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaUser className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">Họ và tên</div>
                  <div className="font-medium text-base text-gray-700">
                    {user.fullName}
                  </div>
                </div>
              </div>
              {/* Ngày sinh */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaBirthdayCake className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">Ngày sinh</div>
                  <div className="font-medium text-base text-gray-700">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString("vi-VN")
                      : "-"}
                  </div>
                </div>
              </div>
              {/* Tên tài khoản */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaUserTag className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">
                    Tên tài khoản
                  </div>
                  <div className="font-medium text-base text-gray-700">
                    {user.username}
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaEnvelope className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">Email</div>
                  <div className="font-medium text-base text-gray-700">
                    {user.email}
                  </div>
                </div>
              </div>
              {/* Giới tính */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaTransgender className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">Giới tính</div>
                  <div className="font-medium text-base text-gray-700">
                    {user.gender === "MALE"
                      ? "Nam"
                      : user.gender === "FEMALE"
                      ? "Nữ"
                      : "Khác"}
                  </div>
                </div>
              </div>
              {/* Vai trò */}
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3">
                <FaUserTag className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs mb-1">Vai trò</div>
                  <div className="font-medium text-base text-gray-700">
                    {user.role?.name || userRole}
                  </div>
                </div>
              </div>
              {/* Địa chỉ */}
              {user.address && (
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm flex items-center gap-3 md:col-span-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Địa chỉ</div>
                    <div className="font-medium text-base text-gray-700">
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
