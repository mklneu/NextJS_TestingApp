import { useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import InputBar from "../Input";
import { postUser } from "@/services/UserServices";

interface IAddNewModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onSubmit: () => void; // Callback function to handle submission
}

const AddNewUserModal = (props: IAddNewModalProps) => {
  const { show, setShow, onSubmit } = props;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const handleSubmit = async () => {
    if (!username || !password || !email || !age || !address) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      await postUser(username, email, password, gender, address, age);

      // Refresh the blogs list
      onSubmit(); // Call the onSubmit callback if provided

      setUsername("");
      setPassword("");
      setEmail("");
      setAge(0);
      setAddress("");
      setGender("");

      setShow(false); // Close modal after submission
    } catch (error) {
      console.error("Error creating blog:", error);
      // Error message đã được handle trong postBlog function
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setAge(0);
    setAddress("");
    setGender("");
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
            <h1 className="px-5 py-4 text-2xl">Add New User</h1>
            <hr className="mb-6 text-gray-200" />
            <InputBar
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></InputBar>
            <InputBar
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></InputBar>
            <InputBar
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></InputBar>
            <InputBar
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            ></InputBar>
            <InputBar
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></InputBar>
            <InputBar
              type="select"
              value={gender}
              placeholder="Select gender"
              onChange={(e) => setGender(e.target.value)}
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
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
              <Button size="md" onClick={() => handleSubmit()}>
                Add
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewUserModal;
