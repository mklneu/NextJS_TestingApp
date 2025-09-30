import { useState } from "react";
import Button from "../Button";
import { AxiosError } from "axios";

interface UpdateInfoModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  user: resUser;
  onUpdate: (data: Partial<reqUser>) => Promise<void>;
}

const UpdateInfoModal = ({
  show,
  setShow,
  user,
  onUpdate,
}: UpdateInfoModalProps) => {
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    dob: user.dob ? user.dob.slice(0, 10) : "",
    gender: user.gender || "",
    address: user.address || "",
    username: user.username || "",
    company: user.company ? { id: user.company.id } : { id: 0 },
    role: user.role ? { id: user.role.id } : { id: 0 },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await onUpdate(form);
      setShow(false);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setMessage(err?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative animate-fadeIn overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Chỉnh sửa hồ sơ</h3>
        </div>
        <form className="p-8 pt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                id="fullName"
                className="peer w-full border border-blue-200 text-gray-700 h-12
                rounded-lg px-3 py-3 focus:outline-none
                 bg-white placeholder-transparent"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                required
                placeholder="Họ và tên"
                autoComplete="off"
              />
              <label
                htmlFor="fullName"
                className="absolute left-3 -top-2 text-gray-500 
                text-xs bg-white px-1 pointer-events-none"
              >
                Họ và tên
              </label>
            </div>
            <div className="relative">
              <input
                type="date"
                id="dob"
                className="peer w-full border border-blue-200 text-gray-700 h-12
                rounded-lg px-3 py-3 focus:outline-none 
                 bg-white placeholder-transparent"
                value={form.dob}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dob: e.target.value }))
                }
                required
                placeholder="Ngày sinh"
              />
              <label
                htmlFor="dob"
                className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 pointer-events-none"
              >
                Ngày sinh
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="peer w-full border border-blue-200 text-gray-700 h-12
                rounded-lg px-3 py-3 focus:outline-none cursor-not-allowed
                 bg-white placeholder-transparent"
                value={user.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                placeholder="Email"
                autoComplete="off"
                disabled
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 pointer-events-none"
              >
                Email
              </label>
            </div>
            <div className="relative">
              <select
                id="gender"
                className="peer w-full border border-blue-200 text-gray-700 h-12
                rounded-lg px-3 py-3 focus:outline-none 
             bg-white placeholder-transparent"
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gender: e.target.value }))
                }
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
              <label
                htmlFor="gender"
                className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 pointer-events-none"
              >
                Giới tính
              </label>
            </div>
            <div className="relative md:col-span-2">
              <input
                type="text"
                id="address"
                className="peer w-full border border-blue-200 text-gray-700 h-12
                rounded-lg px-3 py-3 focus:outline-none 
                 bg-white placeholder-transparent"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="Địa chỉ"
              />
              <label
                htmlFor="address"
                className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 pointer-events-none"
              >
                Địa chỉ
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShow(false)}
              className={saving ? "opacity-60 pointer-events-none" : ""}
            >
              Hủy
            </Button>
            <Button
              size="md"
              className={saving ? "opacity-60 pointer-events-none" : ""}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
          {message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  ) : null;
};

export default UpdateInfoModal;
