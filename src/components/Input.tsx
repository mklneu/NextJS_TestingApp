interface IInputProps {
  type?: "text" | "email" | "password" | "textarea";
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  rows?: number; // Chỉ dùng cho textarea
}

const InputBar = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  className = "",
  rows = 4,
}: IInputProps) => {
  const baseClasses =
    "w-full h-full bg-transparent rounded-xl pl-5 pr-14 placeholder:text-gray-700 border border-cyan-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300 hover:shadow-md placeholder-opacity-70 focus:placeholder-opacity-40";

  const textareaClasses =
    "w-full h-full bg-transparent rounded-xl pl-5 pr-14 pt-3  placeholder:text-gray-700 border border-cyan-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300 hover:shadow-md placeholder-opacity-70 focus:placeholder-opacity-40";

  if (type === "textarea") {
    return (
      <div className="flex w-11/12 mb-4 mx-auto">
        <textarea
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${textareaClasses} ${className}`}
        />
      </div>
    );
  }

  return (
    <div className="flex w-11/12 h-12 mb-4 mx-auto">
      <input
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${className}`}
      />
    </div>
  );
};

export default InputBar;
