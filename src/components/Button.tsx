interface IButtonProps {
  variant?: "primary" | "secondary" | "danger" | "alarm";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button = ({
  variant = "primary",
  size = "sm",
  onClick,
  children,
  className = "",
}: IButtonProps) => {
  const baseClasses = "rounded font-medium duration-200 cursor-pointer";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    alarm: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} 
      ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
