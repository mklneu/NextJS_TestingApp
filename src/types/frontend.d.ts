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
  role?: { id: number; name: string };
  company?: { id: number; name: string };
  // [key: string]: any; // For any other properties
}

interface Hospital {
  id: number;
  name: string;
  address: string;
  logo: string;
  description: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}
