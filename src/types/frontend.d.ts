interface IButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  dob: string;
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
