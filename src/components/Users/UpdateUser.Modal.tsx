import { useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import InputBar from "../Input";
import { getPatientById, updatePatient } from "@/services/PatientServices";
import { genderOptions } from "@/utils/map";

interface Option {
  label: string;
  value: string | number;
}

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void;
  userId: number;
  setUserId: (value: number | null) => void;
  roleOptions: Option[]; // [{ label: "Admin", value: 1 }, ...]
  companyOptions: Option[]; // [{ label: "Company A", value: 1 }, ...]
}

const UpdateUserModal = (props: IUpdateModalProps) => {
  const {
    show,
    setShow,
    onUpdate,
    userId,
    setUserId,
    roleOptions,
    companyOptions,
  } = props;

  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [role, setRole] = useState<number | string>("");
  const [company, setCompany] = useState<number | string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const user = await getPatientById(userId);
          setUsername(user.username);
          setFullName(user.fullName || "");
          setEmail(user.email);
          setDob(user.dob || "");
          setAddress(user.address);
          setGender(user.gender);
          setRole(user.role?.id || "");
          setCompany(user.company?.id || "");
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Failed to fetch user details.");
        }
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleUpdate = async () => {
    if (!username || !fullName || !email || !dob || !role || !company) {
      toast.error("Please fill in all fields!");
      return;
    }
    try {
      await updatePatient(
        userId,
        username,
        fullName,
        gender,
        address,
        dob,
        { id: Number(company) },
        { id: Number(role) }
      );
      onUpdate();
      setShow(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleClose = () => {
    setUserId(null);
    setShow(false);
  };

  return (
    <>
      {show && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex justify-center items-center bg-[rgba(0,0,0,0.4)] fixed w-full min-h-screen top-0 right-0 p-4 z-50"
        >
          <div
            className="mx-auto bg-white text-black 
          rounded-lg shadow-2xl border border-gray-400 w-[65%]"
          >
            <h1 className="px-5 py-4 text-2xl">
              Cập nhật người dùng{" "}
              <span className="text-gray-600 font-bold text-sm">
                no.{userId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
              {/* Cột 1 */}
              <div className="flex flex-col gap-4">
                <InputBar
                  label="Tên tài khoản"
                  value={username}
                  placeholder="Tên tài khoản"
                  disabled={true}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputBar
                  label="Họ và tên"
                  value={fullName}
                  placeholder="Họ và tên"
                  disabled={true}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <InputBar
                  label="Email"
                  value={email}
                  placeholder="Email"
                  disabled={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Cột 2 */}
              <div className="flex flex-col gap-4 ">
                <InputBar
                  label="Ngày sinh"
                  type="date"
                  value={dob}
                  placeholder="Ngày sinh"
                  disabled={true}
                  onChange={(e) => setDob(e.target.value)}
                />
                <InputBar
                  label="Địa chỉ"
                  value={address}
                  placeholder="Địa chỉ"
                  disabled={true}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <InputBar
                  label="Giới tính"
                  type="select"
                  value={gender}
                  placeholder="Chọn giới tính"
                  disabled={true}
                  onChange={(e) => setGender(e.target.value)}
                  options={genderOptions}
                />
              </div>
              {/* Cột 3 */}
              <div className="flex flex-col gap-4">
                <InputBar
                  label="Vai trò"
                  type="select"
                  value={role}
                  placeholder="Chọn vai trò"
                  onChange={(e) => setRole(e.target.value)}
                  options={roleOptions.map((opt) => ({
                    ...opt,
                    value: String(opt.value),
                  }))}
                  className="!w-full"
                />
                <InputBar
                  label="Bệnh viện"
                  type="select"
                  value={company}
                  placeholder="Chọn bệnh viện"
                  onChange={(e) => setCompany(e.target.value)}
                  options={companyOptions.map((opt) => ({
                    ...opt,
                    value: String(opt.value),
                  }))}
                />
              </div>
            </div>
            <div className="flex justify-end mx-auto gap-2 mt-8 mb-8 w-11/12">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleUpdate} size="sm">Update</Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateUserModal;
