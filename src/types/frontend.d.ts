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

interface Doctor {
  id: number;
  fullName: string;
  email: string;
  username: string;
  gender: string;
  specialty: string;
  phoneNumber: string;
  age: number;
  experienceYears: number;
  address: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  company: { id: number } | null;
  //   certifications?: string[];
  //   education?: string;
  //   scheduleDays?: string[];
  //   scheduleHours?: string;
  //   about?: string;
  //   rating?: number;
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
