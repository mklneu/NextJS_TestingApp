"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { login } from "@/services/AuthServices";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setIsLoggedIn, setUserName } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      await login(username, password, setIsLoggedIn, setUserName);
      // toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại!");
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-blue-100">
        <h1 className="mb-2 text-center text-blue-700 text-4xl font-extrabold tracking-tight">
          Đăng nhập
        </h1>
        <p className="mb-8 text-center text-gray-500 text-sm">
          Chào mừng bạn đến với{" "}
          <span className="font-semibold text-blue-600">SmartHealth</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-blue-400 text-lg" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              autoFocus
              className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-blue-400 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 transition"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-4 cursor-pointer
              text-blue-400 hover:text-blue-600"
              tabIndex={-1}
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold cursor-pointer
              text-white bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-lg ${
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
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
