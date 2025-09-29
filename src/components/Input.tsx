interface IOption {
  label: string;
  value: string;
}

interface IInputProps {
  type?: "text" | "email" | "password" | "textarea" | "select" | "date";
  placeholder?: string;
  value: string | number;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  className?: string;
  rows?: number; // Chỉ dùng cho textarea
  onClick?: () => void; // Chỉ dùng cho input bình thường
  options?: IOption[]; // Chỉ dùng cho type select
  label?: string; // Chỉ dùng cho input bình thường
}

const InputBar = ({
  type = "text",
  placeholder = "",
  value = "",
  disabled = false,
  onChange,
  className = "",
  rows = 4,
  options = [],
  onClick,
  label,
}: IInputProps) => {
  const baseClasses =
    "w-full h-full bg-transparent rounded-xl pl-5 pr-14 placeholder:text-gray-700 border border-cyan-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300 hover:shadow-md placeholder-opacity-70 focus:placeholder-opacity-40";

  const textareaClasses =
    "w-full h-full bg-transparent rounded-xl pl-5 pr-14 pt-3  placeholder:text-gray-700 border border-cyan-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300 hover:shadow-md placeholder-opacity-70 focus:placeholder-opacity-40";

  const selectClasses =
    "w-full h-full bg-white rounded-xl pl-5 pr-10 text-gray-700 border border-cyan-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300 hover:shadow-md cursor-pointer";

  if (type === "textarea") {
    return (
      <div className="flex w-11/12 mb-4 mx-auto">
        {label && (
          <label className="text-sm font-medium text-gray-700 px-1 absolute -top-[10.5px] left-3 bg-white">
            {label}
          </label>
        )}
        <textarea
          placeholder={placeholder}
          required
          value={value}
          disabled={disabled}
          onChange={onChange}
          rows={rows}
          className={`${textareaClasses} ${className}`}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="flex w-11/12 h-12 mb-4 mx-auto relative ">
        {label && (
          <label className="text-sm font-medium text-gray-700 px-1 absolute -top-[10.5px] left-3 bg-white">
            {label}
          </label>
        )}
        <select
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`${selectClasses} ${className} appearance-none `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="py-2 px-4 hover:bg-blue-100 "
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow using Tailwind only */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Xử lý riêng cho type="date"
  if (type === "date") {
    return (
      <div className="flex w-11/12 h-12 mb-4 mx-auto relative">
        {label && (
          <label className="text-sm font-medium text-gray-700 px-1 absolute -top-3 left-3 bg-white">
            {label}
          </label>
        )}
        <input
          type="date"
          placeholder={placeholder}
          required
          value={value}
          disabled={disabled}
          onChange={onChange}
          onClick={onClick}
          className={`${baseClasses} ${className}`}
        />
      </div>
    );
  }

  return (
    <div className="flex w-11/12 h-12 mb-4 mx-auto relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 px-1 absolute -top-3 left-3 bg-white">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        required
        value={value}
        disabled={disabled}
        onChange={onChange}
        onClick={onClick}
        className={`${baseClasses} ${className}`}
      />
    </div>
  );
};

export default InputBar;
