import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import Button from "@/components/Button";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/frontend";

export interface Hospital {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  logo: string;
  description: string;
  specialty: Specialty[];
}

interface Specialty {
  id: number;
  specialtyName: string;
  description: string;
}

// Lấy tất cả bệnh viện
const getAllHospitals = async () => {
  try {
    const response = await axiosInstance.get("/hospitals");
    return response.data.data.data || [];
  } catch (error) {
    console.error("❌ Error in getAllHospitals:", error);
    throw error;
  }
};

// Lấy bệnh viện theo id
const getHospitalById = async (hospitalId: number) => {
  try {
    const response = await axiosInstance.get(`/hospitals/${hospitalId}`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getHospitalById:", error);
    toast.error("❌ Error while fetching hospital by ID!");
    throw error;
  }
};

// Thêm bệnh viện mới
const postHospital = async (name: string, address: string, phone: string) => {
  try {
    const response = await axiosInstance.post("/hospitals", {
      name,
      address,
      phone,
    });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in postHospital:", error);
    toast.error(err?.response?.data?.error);
    throw error;
  }
};

// Cập nhật bệnh viện
const updateHospital = async (
  hospitalId: number,
  name: string,
  address: string,
  phone: string
) => {
  try {
    const response = await axiosInstance.put(`/hospitals/${hospitalId}`, {
      name,
      address,
      phone,
    });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updateHospital:", error);
    toast.error(err?.response?.data?.error);
    throw error;
  }
};

// Xóa bệnh viện
const deleteHospitalById = async (hospitalId: number, onDelete: () => void) => {
  const confirmDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col p-2 w-full">
          <div className="flex items-center mb-3">
            <span className="font-medium text-gray-800">
              Are you sure to delete this hospital?
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={async () => {
                closeToast();
                try {
                  const response = await axiosInstance.delete(
                    `/hospitals/${hospitalId}`
                  );
                  onDelete();
                  toast.success(response.data.message);
                } catch (error) {
                  console.error("❌ Error in deleteHospital: ", error);
                  toast.error("❌ Error while deleting hospital!");
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </Button>
            <Button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        className: "custom-confirm-toast",
      }
    );
  };

  confirmDelete();
};

export {
  getAllHospitals,
  getHospitalById,
  postHospital,
  updateHospital,
  deleteHospitalById,
};
