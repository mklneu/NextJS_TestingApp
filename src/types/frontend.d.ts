interface IButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface User {
  username: string;
  email: string;
  age: number;
  address: string;
  gender: string;
  // [key: string]: any; // For any other properties
}

interface ErrorResponse {
  error?: string;
  message?: string;
}
