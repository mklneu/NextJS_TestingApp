import { Gender } from "@/types/frontend";

export interface StaffProfile {
  profileId: number;
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  employeeId: string;
  department: string;
  hospital: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface ReqUpdateStaff {
  phoneNumber: string;
  fullName: string;
  dob: string;
  gender: Gender;
  address: string;
  hospitalId: number | string;
  employeeId: string;
  department: string;
}
