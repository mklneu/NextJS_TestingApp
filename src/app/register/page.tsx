"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaVenusMars,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import { register } from "@/services/AuthServices";

const genderList = [
  { value: "", label: "Chọn giới tính" },
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    age: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.gender ||
      !form.address ||
      !form.age
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (isNaN(Number(form.age)) || Number(form.age) < 1) {
      toast.error("Tuổi phải là số hợp lệ!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(
        form.username,
        form.email,
        form.password,
        form.gender,
        form.address,
        Number(form.age)
      );
      router.push("/login");
    } catch (error) {
      //   toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
      console.error("Lỗi đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-2">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-blue-100">
        <h1 className="mb-1 text-center text-blue-700 text-3xl font-extrabold tracking-tight">
          Đăng ký tài khoản
        </h1>
        <p className="mb-4 text-center text-gray-500 text-sm">
          Tạo tài khoản mới để sử dụng{" "}
          <span className="font-semibold text-blue-600">SmartHealth</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-blue-400 text-lg" />
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={form.username}
                className="h-12 pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-blue-400 text-lg" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                className="h-12 pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-blue-400 text-lg" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                className="h-12 pl-10 pr-10 py-3 w-full rounded-lg border
                 border-gray-300 focus:border-blue-500 focus:ring-2
                  focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-4 cursor-pointer text-blue-400 hover:text-blue-600"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-4 text-blue-400 text-lg" />
              <select
                name="gender"
                value={form.gender}
                className="h-12 appearance-none pl-10 pr-3 py-3 w-full rounded-lg border
                  border-gray-300 focus:border-blue-500 focus:ring-2
                  focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
              >
                {genderList.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-4 text-blue-400 text-lg" />
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={form.address}
                className="h-12 pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <FaBirthdayCake className="absolute left-3 top-4 text-blue-400 text-lg" />
              <input
                type="text"
                name="age"
                placeholder="Tuổi"
                value={form.age}
                min={1}
                className="h-12 pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white cursor-pointer
                 bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Đang đăng ký...
              </span>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
