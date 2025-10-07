import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import Button from "@/components/Button";
import { AxiosError } from "axios";

const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");

    return response.data.data.data || [];
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error);
    // toast.error("Failed to fetch users");
    throw error; // Re-throw để component handle được
  }
};

const getUserById = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    toast.error("❌ Error while fetching user by ID!");
    throw error; // Re-throw để component handle được
  }
};

const postUser = async (
  username: string,
  fullName: string,
  email: string,
  password: string,
  gender: string,
  address: string,
  dob: string
) => {
  try {
    // Uncomment dòng dưới khi có backend
    const response = await axiosInstance.post("/users", {
      username,
      fullName,
      email,
      password,
      gender,
      address,
      dob,
    });
    toast.success(response.data.message);
    console.log(">>>>>> data user", response.data);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in postUser:", error);
    toast.error(err?.response?.data?.error);
    throw error; // Re-throw để component handle được
  }
};

const updateUser = async (
  userId: number,
  username: string,
  fullName: string,
  gender: string,
  address: string,
  dob: string,
  company: { id: number },
  role: { id: number }
) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, {
      username,
      gender,
      address,
      fullName,
      dob,
      company,
      role,
    });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    console.error("❌ Error in updateUser:", error);
    toast.error(err?.response?.data?.error);
    throw error; // Re-throw để component handle được
  }
};

const deleteUserById = async (userId: number, onDelete: () => void) => {
  // Custom confirm toast
  const confirmDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col p-2 w-full">
          <div className="flex items-center mb-3">
            <span className="font-medium text-gray-800">
              Bạn muốn xóa người dùng này?
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={async () => {
                closeToast();
                try {
                  const response = await axiosInstance.delete(
                    `/users/${userId}`
                  );
                  onDelete();
                  toast.success(response.data.message);
                } catch (error) {
                  console.error("❌ Error in deleteUser: ", error);
                  toast.error("❌ Error while deleting user!");
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Xóa
            </Button>
            <Button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Hủy
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
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUserById,
};
