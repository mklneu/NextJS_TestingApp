import { useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import InputBar from "../Input";
import { getUserById, updateUser } from "@/services/UserServices";

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void; // Callback function to handle submission
  userId: number; // Optional user ID for updating
  setUserId: (value: number | null) => void; // Optional setter for userId
}

const UpdateUserModal = (props: IUpdateModalProps) => {
  const { show, setShow, onUpdate, userId, setUserId } = props;

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  useEffect(() => {
    // Fetch the user details if userId is provided
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const user = await getUserById(userId);
          setUsername(user.username);
          setEmail(user.email);
          setAge(user.age);
          setAddress(user.address);
          setGender(user.gender);
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Failed to fetch user details.");
        }
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleUpdate = async () => {
    if (!username || !email) {
      toast.error("Please fill in all fields!");
      return;
    }
    try {
      await updateUser(userId, username, gender, address, age);
      // Refresh the blogs list
      onUpdate(); // Call the onUpdate callback if provided
    } catch (error) {
      console.error("Error creating blog:", error);
      // Error message đã được handle trong postBlog function
    }
  };

  const handleClose = () => {
    setUserId(null); // Reset userId when closing the modal
    setShow(false); // Close modal
  };

  return (
    <>
      {show && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`flex justify-between bg-[rgba(0,0,0,0.4)] fixed
          items-center w-full min-h-screen mb-6 top-0 right-0 p-4 z-50`}
        >
          <div
            className="mx-auto bg-white text-black 
          rounded-lg shadow-2xl border border-gray-400
          w-196"
          >
            <h1 className="px-5 py-4 text-2xl">
              Cập nhật người dùng{" "}
              <span className="text-gray-600 font-bold text-sm">
                no.{userId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />
            <InputBar
              label="Tên tài khoản"
              value={username}
              placeholder="Tên tài khoản"
              onChange={(e) => setUsername(e.target.value)}
            ></InputBar>
            <InputBar
              label="Email"
              value={email}
              placeholder="Email"
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            ></InputBar>
            <InputBar
              label="Tuổi"
              value={age}
              placeholder="Tuổi"
              onChange={(e) => setAge(Number(e.target.value))}
            ></InputBar>
            <InputBar
              label="Địa chỉ"
              value={address}
              placeholder="Địa chỉ"
              onChange={(e) => setAddress(e.target.value)}
            ></InputBar>
            <InputBar
              label="Giới tính"
              type="select"
              value={gender}
              placeholder="Chọn giới tính"
              onChange={(e) => setGender(e.target.value)}
              options={[
                { label: "Nam", value: "MALE" },
                { label: "Nữ", value: "FEMALE" },
                { label: "Khác", value: "OTHER" },
              ]}
            ></InputBar>

            <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
              <Button size="md" onClick={() => handleUpdate()}>
                Update
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default UpdateUserModal;
