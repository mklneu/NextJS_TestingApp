import React from "react";

// 1. Thêm icon và isLoading vào props
interface IButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "alarm"
    | "green"
    | "purple"
    | "lightBlue"
    | "white"
    | "none"
    | "confirmed"
    | "requested"
    | "in_progress"
    | "preliminary"
    | "completed"
    | "reviewed"
    | "cancelled"
    | "pending";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  translate?: boolean;
  disabled?: boolean;
}

const Button = ({
  variant = "primary",
  size = "sm",
  onClick,
  children,
  className = "",
  icon,
  isLoading = false,
  translate = true,
  disabled = false,
}: IButtonProps) => {
  const baseClasses =
    "shadow-md hover:shadow-lg rounded-lg font-medium duration-300 cursor-pointer outline-none flex items-center justify-center gap-2";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    alarm: "bg-yellow-500 hover:bg-yellow-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    purple: "bg-indigo-500 hover:bg-indigo-600 text-white",
    lightBlue: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    white: "bg-gray-100 hover:bg-gray-100 text-gray-600",
    none: "border border-gray-300",
    confirmed: "bg-green-500 hover:bg-green-600 text-white",
    requested: "bg-yellow-500 hover:bg-yellow-600 text-white",
    in_progress: "bg-blue-500 hover:bg-blue-600 text-white",
    preliminary: "bg-purple-500 hover:bg-purple-600 text-white",
    completed: "bg-gray-500 hover:bg-gray-600 text-white",
    reviewed: "bg-indigo-500 hover:bg-indigo-600 text-white",
    cancelled: "bg-red-500 hover:bg-red-600 text-white",
    pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  const translateClass = translate ? " hover:-translate-y-[2px]" : "";

  // 2. Thêm class cho trạng thái disabled/loading
  const loadingClasses = "disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} 
      ${sizeClasses[size]} ${loadingClasses} ${className}
      ${translateClass}`}
      onClick={onClick}
      disabled={isLoading || disabled} // Vô hiệu hóa nút khi đang loading
    >
      {/* 3. Hiển thị spinner hoặc icon + children */}
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
