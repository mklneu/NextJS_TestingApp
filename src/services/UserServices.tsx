import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import { PatientProfile, ReqUpdatePatient } from "./PatientServices";
import { DoctorProfile, ReqUpdateDoctor } from "./DoctorServices";
import { ReqUpdateStaff, StaffProfile } from "./StaffServices";

export type UserProfile = PatientProfile | DoctorProfile | StaffProfile;

export interface ReqUpdateMyProfile {
  patientProfile?: ReqUpdatePatient | null;
  doctorProfile?: ReqUpdateDoctor | null;
  staffProfile?: ReqUpdateStaff | null;
}

const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get(`/users/me`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getMyProfile:", error);
    toast.error("❌ Error while fetching Patient by ID!");
    throw error; // Re-throw để component handle được
  }
};

const updateMyProfile = async (body: ReqUpdateMyProfile) => {
  try {
    const response = await axiosInstance.put(`/users/me`, body);
    toast.success("Cập nhật thông tin cá nhân thành công!");

    return response.data.data;
  } catch (error) {
    console.error("❌ Error in updateMyProfile:", error);
    toast.error("❌ Error while updating profile!");
    throw error;
  }
};

export { getMyProfile, updateMyProfile };
